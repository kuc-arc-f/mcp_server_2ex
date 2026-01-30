
import express from 'express';
import cookieParser from "cookie-parser";
import { renderToString } from 'react-dom/server';
import { CopilotClient } from "@github/copilot-sdk";
import 'dotenv/config'
import duckdb from "duckdb";
import ollama from 'ollama'

import Top from './pages/App';
import LibConfig from './lib/LibConfig';
import commonRouter from './routes/common';

const app = express();
const db = new duckdb.Database("./vector.db");

async function generateEmbedding(text) {
  const response = await ollama.embeddings({
    model: "qwen3-embedding:0.6b",
    prompt: text
  });
  return response.embedding;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
console.log("env=", process.env.NODE_ENV)
//console.log(process.env);

const errorObj = {ret: "NG", messase: "Error"};

/**
*
* @param
*
* @return
*/
async function CheckSimalirity(query, conn, res) {
  try{
    // クエリの埋め込みベクトルを生成
    const queryEmbedding = await generateEmbedding(query);
    console.log(`qvec.len=`, queryEmbedding.length);
    let targetEmbed = null;
    if(queryEmbedding.length === 0) {
      throw new Error("error, queryEmbedding none");
    }
    targetEmbed = queryEmbedding;
    //console.log(`targetEmbed.len=`, targetEmbed.length);
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
        return res.send({ret: 500, text: ""});
      } else {
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
        const out = await sendText(outStr)
        res.send({ret: 200, text: out});
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
  const out = response?.data.content
  console.log(out);
  return out
  //process.exit(0);  
}
//app.use('/api/common', commonRouter);
// API
app.post('/api/chat', async (req: any, res: any) => {
  try {
    const body = req.body;
    console.log(body)
    // DB作成
    const conn = db.connect();
  // ベクトル拡張機能をインストール・ロード
  // 注意: インターネット接続が必要な場合があります。
  // 環境によっては 'INSTALL vss' が失敗することがあります。(オフライン環境など)
    conn.all(`INSTALL vss; LOAD vss;`, async (err) => {
      if (err) {
        console.warn('警告: 拡張機能のロードエラー:', err.message);
        console.warn('VSS拡張機能なしで続行します。FLOAT[N]型はDuckDBの基本機能として使用可能です。');
        return res.send({ret: 500, text: ""})
      } else {
        console.log('✓ VSS拡張機能をロードしました');
        const query = await CheckSimalirity(body.messages, conn, res);
      }

    });    
  } catch (error) {
    res.sendStatus(500);
  }
});

// SPA
app.get('/*', (req: any, res: any) => {
  try {
    res.send(renderToString(Top()));
  } catch (error) {
    res.sendStatus(500);
  }
});

//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
console.log('start');
