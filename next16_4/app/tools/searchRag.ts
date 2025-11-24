import ollama from 'ollama'
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { Client } from "pg";
import pgvector from 'pgvector/pg';

/**
*
* @param
*
* @return
*/
async function EmbedUserQuery(query) {
    const MODEL_EMBED_NAME="qwen3-embedding:0.6b";
    const res = await ollama.embed({
        model: MODEL_EMBED_NAME,
        truncate: true,
        input: query,
    })
   return  res.embeddings[0]
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
    await pgvector.registerTypes(client);
    const qvec = await EmbedUserQuery(query)
    //console.log(qvec);
    console.log(`qvec.len=`, qvec.length);
    const result = await client.query(
      `
      SELECT content, embedding <-> $1 AS distance
      FROM documents
      ORDER BY distance
      LIMIT 3
      `,
      [pgvector.toSql(qvec)]
    );    
    client.end()  

    const contexts = result.rows.map((r) => r.content).join("\n---\n");
    let matches = contexts;

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
  
  const result = await generateText({
    model: google(MODEL_NAME),
    maxSteps: 5,
    messages: [{ role: "user", content: newQuery }],
  });
  console.log("artifact:");
  console.log(result.text);
  return result.text;
}