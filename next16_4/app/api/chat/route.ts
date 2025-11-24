
import { NextResponse } from "next/server";
//import RpcClient from '../../lib/RpcClient'
//const __dirname = process.cwd();
//const CMD_PATH = __dirname + "/dist/rust_mcp_server_14.exe"
//console.log("CMD_PATH=", CMD_PATH)
import { Chat } from "../../tools/searchRag";


export async function POST(req: Request) {
  const retObj = {ret: 500, data: null}
  try{  
    const reqJson = await req.json();
    console.log(reqJson);
    const resp = await Chat(reqJson.messages, "sess1")
    console.log(resp);
    retObj.ret = 200;
    retObj.data = resp;

    return NextResponse.json(retObj);
  } catch (error) {
    console.error(error);
    return NextResponse.json(retObj);
  }
}
