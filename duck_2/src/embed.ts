import { readFileSync, readdirSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
import duckdb from "duckdb";

const DATA_PATH = `./data`;
// DB作成
const db = new duckdb.Database("vector.db");
const conn = db.connect();
// ベクトル拡張機能をインストール・ロード
// 注意: インターネット接続が必要な場合があります。
// 環境によっては 'INSTALL vss' が失敗することがあります。(オフライン環境など)
conn.all(`INSTALL vss; LOAD vss;`, (err) => {
  if (err) {
    console.warn('警告: 拡張機能のロードエラー:', err.message);
    console.warn('VSS拡張機能なしで続行します。FLOAT[N]型はDuckDBの基本機能として使用可能です。');
    // エラーでも続行する形に変更 (VSSは検索用で、テーブル作成だけならCore機能でいける場合があるため)
  } else {
    console.log('✓ VSS拡張機能をロードしました');
  }

  // テーブル作成
  createTable();
});

/**
*
* @param
*
* @return
*/
function createTable() {
  // VECTOR型ではなく FLOAT[n] (固定長リスト) を使用
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS embeddings (
      id TEXT PRIMARY KEY,
      text VARCHAR,
      vector FLOAT[3072]
    );
  `;
  //-- n次元ベクトルの例

  conn.run(createTableSQL, (err) => {
    if (err) {
      console.error('テーブル作成エラー:', err);
      return;
    }
    console.log('✓ テーブルを作成しました');

    // データ挿入
    addEmbed();
  });
}
/**
*
* @param
*
* @return
*/
async function EmbedUserQuery(query) {
   const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',

        contents: [
          query
        ],
    });

    console.log("len=", response.embeddings.length);    
    return response.embeddings
}

/**
*
* @param
*
* @return
*/
async function addEmbed() {
  try{  

    const files = readdirSync(DATA_PATH);
    const documents = [];
    for (const f of files) {
      const content = readFileSync(`${DATA_PATH}/${f}`, "utf-8");
      const myUuid = uuidv4();
      let row = { id: myUuid, text: content, metadata: { category: 'none' } };
      documents.push(row)
    }
    //console.log(documents)
    const chunkSizeMax = 500; 
    const textSplitter = new CharacterTextSplitter({
      chunkSize: chunkSizeMax,
      chunkOverlap: 0,
    });
    // ベクトルは明示的にキャストするか、ドライバが配列を正しく認識できるようにする
    // バージョンによってはJS配列がそのまま渡らない場合があるため、CASTを利用すると安全な場合がある
    // また、配列がうまく渡らない場合は `JSON.stringify` や 文字列 `[0.1, 0.2, 0.9]` で渡す必要があるかもしれない
    const stmt = conn.prepare(`INSERT INTO embeddings 
      (id, text, vector) VALUES 
      (?, ?, CAST(? AS FLOAT[3072]))
    `);
    for (const doc of documents) {
      console.log("doc=", doc.text)
      const texts = await textSplitter.splitText(doc.text);
      for (let i = 0; i < texts.length; i++) {
        let target = texts[i];
        const queryEmbedding = await EmbedUserQuery(target);
        console.log(`qvec.len=`, queryEmbedding.length);
        if(queryEmbedding.length === 0) {
          throw new Error("error, queryEmbedding none");
        }
        const targetEmbed = queryEmbedding[0].values;
        console.log(`targetEmbed.len=`, targetEmbed.length);        

        const myUuid = uuidv4(); 
        // JS配列をDuckDBのリストリテラル文字列形式に変換して渡す
        // Array bindingがうまくいかない環境のためのワークアラウンド
        const vectorStr = `[${targetEmbed.join(', ')}]`;
        stmt.run(myUuid , target, vectorStr, (err) => {
          if (err) {
            // 重複エラーなどはここでキャッチ
            console.error(`データ挿入エラー (ID: ${myUuid}):`, err.message);
          } else {
            console.log(`✓ データ挿入成功.len=: ${vectorStr.length}`);
          }

        });        

      }      
    }
    stmt.finalize();
  } catch (error) {
    console.error(error);
  }
}
