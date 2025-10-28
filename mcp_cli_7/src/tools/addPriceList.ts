import { generateText, tool } from 'ai';
import { z } from 'zod';
import path from 'node:path';
import { fileURLToPath } from 'url';
import RpcClient from '../lib/RpcClient'
import 'dotenv/config'

//const __filename = fileURLToPath(import.meta.url);
//let __dirname = path.dirname(__filename);
//const CMD_PATH = __dirname + "/rust_mcp_server_6"
const CMD_PATH = process.env.MCP_SERVER_PATH

export const addPriceList = tool({
  description: "品名と価格を受け取り, APIに 送信して欲しい。",
  parameters: z.object({
    name: z.string().min(1, { message: 'タイトルは必須です' }),
    price: z.number().describe("数値")
  }),
  execute: async ({ name, price }) => {
    const client = new RpcClient(CMD_PATH);

    const resp = await client.call(
      "tools/call", 
      { 
        name: "purchase", 
        arguments: {name: name, price: price}, 
      },
    );
  //console.log("add:", resp);
    client.close();
    return "result : " + resp;
  },
});
