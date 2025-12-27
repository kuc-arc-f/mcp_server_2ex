import { readFileSync, readdirSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenAI } from "@google/genai";
import {QdrantClient} from '@qdrant/js-client-rest';
import 'dotenv/config'

const DATA_PATH = `./data`;
const COLLECT_NAME = "sample_collection"
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

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
        const queryEmbedding = await EmbedUserQuery(target);
        console.log(`qvec.len=`, queryEmbedding.length);
        if(queryEmbedding.length === 0) {
          throw new Error("error, queryEmbedding none");
        }
        const targetEmbed = queryEmbedding[0].values;
        console.log(`targetEmbed.len=`, targetEmbed.length);        

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
