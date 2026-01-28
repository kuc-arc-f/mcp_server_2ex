import { CopilotClient } from "@github/copilot-sdk";
import 'dotenv/config'
import duckdb from "duckdb";
import ollama from 'ollama'

// DB作成
const db = new duckdb.Database("vector.db");

async function generateEmbedding(text) {
  const response = await ollama.embeddings({
    model: "qwen3-embedding:0.6b",
    prompt: text
  });
  return response.embedding;
}

/**
*
* @param
*
* @return
*/
async function CheckSimalirity(query, conn) {
  try{

    // クエリの埋め込みベクトルを生成
    const queryEmbedding = await generateEmbedding(query);
    //const queryEmbedding = await EmbedUserQuery(query);
    console.log(`qvec.len=`, queryEmbedding.length);
    let targetEmbed = null;
    if(queryEmbedding.length === 0) {
      throw new Error("error, queryEmbedding none");
    }
    targetEmbed = queryEmbedding;
    console.log(`targetEmbed.len=`, targetEmbed.length);
    // コサイン類似度で検索 (近い順)
    // vss拡張機能の array_cosine_similarity を使用
    // 距離関数を使う場合は array_distance (ユークリッド距離) など
    const searchSQL = `
      SELECT 
        id, 
        text, 
        vector, 
        array_cosine_similarity(vector, CAST(? AS FLOAT[1024])) AS similarity
      FROM embeddings
      ORDER BY similarity DESC
      LIMIT 1;
    `;
    const vectorStr = `[${targetEmbed.join(', ')}]`;
    conn.all(searchSQL, vectorStr, async (err, rows) => {
      if (err) {
        console.error('検索エラー:', err);
      } else {
        //console.log('検索結果 (類似度順):');
        let matches = "";
        let outStr = "";
        rows.forEach((doc, i) => {
          //console.log(`\n${i + 1}. ${doc.id}\n`);
          //console.log(`${doc.text}\n`);
          matches += doc.text + "\n\n";
        })
        if (matches) {
          outStr= `
          context: ${matches}\n
          user query: ${query}
          `;
        } else{
          outStr= `user query: ${query}`;
        }
        console.log("outStr=", outStr)
        await sendText(outStr)
      }
    });
  }catch(e){
    console.log(e)
  }
}

/**
*
* @param
*
* @return
*/
async function sendText(query) {
  const newQuery = `
***
日本語で、回答して欲しい。
要約して欲しい。
${query}
`;
  console.log("formatted query: ", newQuery)
  const client = new CopilotClient();
  const session = await client.createSession({ model: "gpt-4.1" });

  const response = await session.sendAndWait({ prompt: newQuery });
  await client.stop();
  console.log(response?.data.content);

  process.exit(0);  
}

/**
*
* @param
*
* @return
*/
export async function Chat(userQuery, sess) {
  const conn = db.connect();
// ベクトル拡張機能をインストール・ロード
// 注意: インターネット接続が必要な場合があります。
// 環境によっては 'INSTALL vss' が失敗することがあります。(オフライン環境など)
  conn.all(`INSTALL vss; LOAD vss;`, async (err) => {
    if (err) {
      console.warn('警告: 拡張機能のロードエラー:', err.message);
      console.warn('VSS拡張機能なしで続行します。FLOAT[N]型はDuckDBの基本機能として使用可能です。');
    } else {
      console.log('✓ VSS拡張機能をロードしました');
      const query = await CheckSimalirity(userQuery, conn);
      //conn.disconnect();
    }

  });
}