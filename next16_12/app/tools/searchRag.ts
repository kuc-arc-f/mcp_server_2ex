import { ChromaClient } from 'chromadb';
import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ChromaDBクライアントの初期化
const chromaClient = new ChromaClient({
  path: 'http://localhost:8000' // ChromaDBサーバーのURL
});

// コレクション名
const COLLECTION_NAME = 'documents';

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
async function CheckSimalirity(query) {
  try{
    const collection = await chromaClient.getOrCreateCollection({
      name: COLLECTION_NAME
    });

    // クエリの埋め込みベクトルを生成
    const queryEmbedding = await EmbedUserQuery(query);
    console.log(`qvec.len=`, queryEmbedding.length);
    let targetEmbed = null;
    if(queryEmbedding.length === 0) {
      throw new Error("error, queryEmbedding none");
    }
    targetEmbed = queryEmbedding[0].values;
    console.log(`targetEmbed.len=`, targetEmbed.length);
    //console.log(targetEmbed);

    const results = await collection.query({
      queryEmbeddings: [targetEmbed],
      nResults: 2 // 上位3件を取得
    });

    console.log(`\n🔍 検索クエリ: "${query}"\n`);
    console.log('検索結果:'); 
    
    let matches = "";
    let ouStr = "";
    results.documents[0].forEach((doc, i) => {
      console.log(`\n${i + 1}. ${doc}`);
      console.log(`   距離: ${results.distances[0][i].toFixed(4)}`);
      ouStr += doc + "\n\n";
    });
    if(ouStr !== ""){
      matches = `
      context: ${ouStr}\n
      user query: ${query}
      `
    }else{
      matches = "user query: " + query;
    }
    return matches;
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
export async function Chat(userQuery) {
  try{
    const query = await CheckSimalirity(userQuery);
    console.log("Chat.query: ", query)
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
    //console.log(out);
    return out
  }catch(e){
    console.log(e)
  }
}