
import { NextResponse } from "next/server";
import { Chat } from "../../tools/searchRag";


export async function POST(req: Request) {
  const retObj = {ret: 500, data: null}
  try{  
    const reqJson = await req.json();
    console.log(reqJson);
    const resp = await Chat(reqJson.messages)
    console.log(resp);
    retObj.ret = 200;
    retObj.data = resp;

    return NextResponse.json(retObj);
  } catch (error) {
    console.error(error);
    return NextResponse.json(retObj);
  }
}
