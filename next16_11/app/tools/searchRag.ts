import { ChromaClient } from 'chromadb';
import ollama from 'ollama'

// ChromaDBクライアントの初期化
const chromaClient = new ChromaClient({
  path: 'http://localhost:8000' // ChromaDBサーバーのURL
});

// コレクション名
const COLLECTION_NAME = 'documents';
const MODEL_EMBED_NAME="qwen3-embedding:0.6b";

/**
* Ollamaでテキストから埋め込みベクトルを生成
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
async function CheckSimalirity(query) {
  try{
    const collection = await chromaClient.getCollection({
      name: COLLECTION_NAME
    });

    // クエリの埋め込みベクトルを生成
    const queryEmbedding = await generateEmbedding(query);
    console.log(`qvec.len=`, queryEmbedding.length);

    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
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
      //console.log(`   メタデータ:`, results.metadatas[0][i]);
    });

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
export async function Chat(userQuery) {
  try{
    const query = await CheckSimalirity(userQuery);

    const newQuery = `
***
日本語で、回答して欲しい。
${query}
`;
    console.log("formatted query: ", newQuery)
    // Ollamaで回答を生成
    const response = await ollama.chat({
      model: 'gemma3:4b',
      messages: [{
        role: 'user',
        content: newQuery
      }],
      options : {"num_ctx": 1024, "num_predict": 200}
    });

    console.log(`\n💬 質問: "${userQuery}"\n`);
    console.log('回答:', response.message.content);
    return response.message.content;
  }catch(e){
    console.log(e)
  }
}