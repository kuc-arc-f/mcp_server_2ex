import { createInterface } from "node:readline/promises";
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {QdrantClient} from '@qdrant/js-client-rest';
import 'dotenv/config'

// コレクション名
const COLLECT_NAME = "sample_collection"


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
async function CheckSimalirity(query, sess) {
  try{
    const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

    // クエリの埋め込みベクトルを生成
    const queryEmbedding = await EmbedUserQuery(query);
    console.log(`qvec.len=`, queryEmbedding.length);
    let targetEmbed = null;
    if(queryEmbedding.length === 0) {
      throw new Error("error, queryEmbedding none");
    }
    targetEmbed = queryEmbedding[0].values;
    console.log(`targetEmbed.len=`, targetEmbed.length);
    const result = await client.search(COLLECT_NAME, {
      vector: targetEmbed,
      limit: 2,
    });
    //console.log(result);
    let matches = "";
    let ouStr = "";
    result.forEach((doc, i) => {
      let content = doc.payload.content
      console.log(`\n${i + 1}. ${doc.payload.content}`);
      ouStr += content + "\n\n";
    })

     return ouStr !== `` ? `
     context: ${ouStr}\n
     user query: ${query}
    ` : query   
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
export async function Chat(userQuery, sess) {
  const query = await CheckSimalirity(userQuery, sess);

  const newQuery = `
***
日本語で、回答して欲しい。
${query}
`;
  console.log("formatted query: ", newQuery)
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

  const prompt = newQuery;

  const result = await model.generateContent(prompt);
  const out = result.response.text()
  console.log(out);
  return out
}