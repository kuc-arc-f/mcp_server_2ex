
import { NextResponse } from "next/server";
import RpcClient from '../../lib/RpcClient'
const __dirname = process.cwd();
const CMD_PATH = __dirname + "/dist/go-mcp-server-15"
console.log("CMD_PATH=", CMD_PATH)

export async function POST(req: Request) {
  const retObj = {ret: 500, data: null}
  try{  
    const reqJson = await req.json();
    console.log(reqJson);
    const client = new RpcClient(CMD_PATH);
    const resp = await client.call(
      "tools/call", 
      { 
        name: "rag_search", 
        arguments: {input_text: reqJson.messages}, 
      },
    );
    client.close();  
    console.log("resp:", resp);
    //@ts-ignore
    if(resp.content[0].text){
      //const json = JSON.parse(resp.content[0].text)
      //console.log(json);
      retObj.ret = 200;
      retObj.data = resp;
      return NextResponse.json(retObj);
    }

    return NextResponse.json(retObj);
  } catch (error) {
    console.error(error);
    return NextResponse.json(retObj);
  }
}
