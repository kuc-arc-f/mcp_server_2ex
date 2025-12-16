import { readFileSync, readdirSync } from "fs";
import ollama from "ollama";
import { ChromaClient } from 'chromadb';
import { v4 as uuidv4 } from "uuid";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { Client } from "pg";
import 'dotenv/config'

const DATA_PATH = `./data`;
const MODEL_NAME="qwen3-embedding:0.6b";
// ChromaDBクライアントの初期化
const chromaClient = new ChromaClient({
  path: 'http://localhost:8000' // ChromaDBサーバーのURL
});

// コレクション名
const COLLECTION_NAME = 'documents';
// Ollamaでテキストから埋め込みベクトルを生成
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
async function main() {
  try{  
    // コレクションを作成または取得
    const collection = await chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME,
      metadata: { description: 'サンプルドキュメント集' }
    });    
    const files = readdirSync(DATA_PATH);
    const documents = [];
    for (const f of files) {
      const content = readFileSync(`${DATA_PATH}/${f}`, "utf-8");
      const myUuid = uuidv4();
      let row = { id: myUuid, text: content, metadata: { category: 'none' } };
      documents.push(row)
    }
    console.log(documents)
    const chunkSizeMax = 500; 
    const textSplitter = new CharacterTextSplitter({
      chunkSize: chunkSizeMax,
      chunkOverlap: 0,
    });
    for (const doc of documents) {
      console.log("doc=", doc.text)
      const texts = await textSplitter.splitText(doc.text);
      for (let i = 0; i < texts.length; i++) {
        let target = texts[i];
        const queryEmbedding = await generateEmbedding(target);
        console.log("embeddings.len=", queryEmbedding.length)
        const myUuid = uuidv4();     
          await collection.add({
            ids: [myUuid],
            embeddings: [queryEmbedding],
            documents: [target],
            metadatas: [{ category: 'none' }]
          });        
      }      
    }
  } catch (error) {
    console.error(error);
  }
}
main();
