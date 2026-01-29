import { readFileSync, readdirSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import {QdrantClient} from '@qdrant/js-client-rest';
import ollama from 'ollama'
import 'dotenv/config'

const DATA_PATH = `./data`;
const COLLECT_NAME = "document-3"
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

/**
*
* @param
*
* @return
*/
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
    const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

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
        console.log(`qvec.len=`, queryEmbedding.length);
        if(queryEmbedding.length === 0) {
          throw new Error("error, queryEmbedding none");
        }
        const targetEmbed = queryEmbedding;
        //console.log(`targetEmbed.len=`, targetEmbed.length);   
        const myUuid = uuidv4(); 
        await client.upsert(COLLECT_NAME, {
          wait: true,
          points: [
            {
              id: myUuid,
              vector: targetEmbed,
              payload: {
                content: target,
              },
            },
          ],
        });        
      }      
    }
  } catch (error) {
    console.error(error);
  }
}
main();
