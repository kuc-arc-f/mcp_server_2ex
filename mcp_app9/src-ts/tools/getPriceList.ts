import { generateText, tool } from 'ai';
import { z } from 'zod';
import path from 'node:path';
import { fileURLToPath } from 'url';
import RpcClient from '../lib/RpcClient'

const __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);
const CMD_PATH = __dirname + "/rust_mcp_server_4"

export const getPriceList = tool({
  description: "購入品リストを、表示します",
  parameters: z.object({
  }),
  execute: async () => {
    const client = new RpcClient(CMD_PATH);

    const resp = await client.call(
      "tools/call", 
      { 
        name: "purchase_list", 
        arguments: null, 
      },
    );
  //console.log("add:", resp);
    client.close();
    return "result : " + resp;
  },
});
