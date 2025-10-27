import { generateText, tool } from 'ai';
import { z } from 'zod';
import RpcClient from '../lib/RpcClient'
import 'dotenv/config'

//const __filename = fileURLToPath(import.meta.url);
//let __dirname = path.dirname(__filename);
//const CMD_PATH = __dirname + "/rust_mcp_server_6"
const CMD_PATH = process.env.MCP_SERVER_PATH
console.log("getPriceXlsxList.CMD_PATH=", CMD_PATH);

export const getPriceXlsxList = tool({
  description: "購入品リスト、ダウンロード リンク、表示します",
  parameters: z.object({
  }),
  execute: async () => {
    const client = new RpcClient(CMD_PATH);

    const resp = await client.call(
      "tools/call", 
      { 
        name: "purchase_list_excel", 
        arguments: {
          template_purchase: process.env.TEMPLATE_PURCHASE,
          xls_out_dir: process.env.XLS_OUT_DIR,
        }, 
      },
    );
    client.close();
    const out = resp.content[0].text
  //console.log("add:", resp);
    return out;
  },
});
