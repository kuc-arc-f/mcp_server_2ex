import RpcClient from '../lib/RpcClient'
const __dirname = process.cwd();
const CMD_PATH = __dirname + "/dist/go-mcp-server-18.exe"
console.log("CMD_PATH=", CMD_PATH)
console.log("PG_CONNECT_STR=", process.env.PG_CONNECT_STR)

const MODEL_EMBED_NAME="qwen3-embedding:0.6b";
/**
*
* @param
*
* @return
*/
export async function Chat(userQuery, pg_conect_str) {
  console.log("PG_CONNECT_STR=", process.env.PG_CONNECT_STR);
  try{
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "rag_search", 
        arguments: {
          query: userQuery,
          pg_conect_str: process.env.PG_CONNECT_STR
        }, 
      },
    );
    client.close();  
    console.log("resp:", resp);
    //@ts-ignore
    if(resp.content[0].text){
      //const json = JSON.parse(resp.content[0].text)
      //@ts-ignore
      const query = resp.content[0].text;
      const newQuery = `
***
日本語で、回答して欲しい。
${query}
`;
      console.log("formatted query: ", newQuery)
      return newQuery;      
    }
  }catch(e){
    console.error(e)
    throw new Error("error, Chat");
  }

}
