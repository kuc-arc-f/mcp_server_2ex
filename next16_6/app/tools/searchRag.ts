//import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { embed } from 'ai';
import { Client } from "pg";

const MODEL_NAME = "gemini-2.0-flash";
const MODEL_EMBED_NAME = "gemini-embedding-001";

/**
*
* @param
*
* @return
*/
async function EmbedUserQuery(query) {
    const googleModel = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY || "",
    });
    const { embedding } = await embed({
      model: googleModel.textEmbeddingModel(MODEL_EMBED_NAME),
      value: query,
    });
    const f = new Float32Array(embedding.flat())
    return  f  
}

/**
*
* @param
*
* @return
*/
function cosineSimilarity(v1, v2) {
    //console.log("using js native")
    v1 = new Float32Array(v1.buffer)
    v2 = new Float32Array(v2.buffer)
    if (v1.length !== v2.length) {
        throw new Error("Vectors must be of the same length.");
    }
    let dot = 0, norm1Sq = 0, norm2Sq = 0;
    for (let i = 0; i < v1.length; i++) {
        const a = v1[i];
        const b = v2[i];
        dot += a * b;
        norm1Sq += a * a;
        norm2Sq += b * b;
    }
    return dot / (Math.sqrt(norm1Sq) * Math.sqrt(norm2Sq));
}
/**
*
* @param
*
* @return
*/
async function CheckSimalirity(query, sess) {
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
  });    
  try{
    await client.connect();
    const sql = `SELECT * FROM embeddings;`;
    const result = await client.query(sql, "");
    client.end()
    if (result.rowCount === 0) {
      console.log(`error, embeddings count = 0`);
      return "";
    }        

    let matches = ``
    if (result.rowCount > 0) {
      const embedding = await EmbedUserQuery(query)
      console.log(`qvec.len=`, embedding.length);
      for (const row of result.rows) {
          const e = new Float32Array(row.embeddings.buffer)
          const sim = cosineSimilarity(embedding, e)
          console.log(`doc: ${row.name}, similarity: ${sim}`)
          //console.log(`doc: ${row.name}, similarity: ${sim}, user query: ${query}`)
          if (sim > 0.6) {
              matches += row.content + "\n"
          }
      }
      
    }

    return matches !== `` ? `
     context: ${matches}\n
     user query: ${query}
    ` : query    
  }catch(e){
    client.end()
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
  const MODEL_NAME = "gemini-2.0-flash";
  console.log("PG_HOST=", process.env.PG_HOST);
  const query = await CheckSimalirity(userQuery, sess);

  const newQuery = `
***
日本語で、回答して欲しい。
${query}
`;
  console.log("formatted query: ", newQuery)
  return newQuery;

}