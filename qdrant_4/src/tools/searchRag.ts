import {QdrantClient} from '@qdrant/js-client-rest';
import { CopilotClient } from "@github/copilot-sdk";
import 'dotenv/config'
import ollama from 'ollama'

// コレクション名
const COLLECT_NAME = "document-3"

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
async function CheckSimalirity(query, sess) {
  try{
    const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

    // クエリの埋め込みベクトルを生成
    const queryEmbedding = await generateEmbedding(query)
    console.log(`qvec.len=`, queryEmbedding.length);
    let targetEmbed = queryEmbedding;
    const result = await client.search(COLLECT_NAME, {
      vector: targetEmbed,
      limit: 1,
    });
    console.log(result);
    //return ""
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