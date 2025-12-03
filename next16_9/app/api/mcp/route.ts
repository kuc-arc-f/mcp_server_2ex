
import { NextResponse } from "next/server";
import { Chat } from "../../tools/searchRag";

/**
*
* @param
*
* @return
*/
const tools = [
  {
    name: 'get_weather',
    description: '指定された都市の天気情報を取得します',
    inputSchema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: '都市名'
        }
      },
      required: ['city']
    }
  },
  {
    name: 'rag_search',
    description: '入力文字から、検索結果を返す',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '入力文字'
        },
      },
      required: ['query']
    }
  },  
];


/**
*
* @param
*
* @return
*/
async function executeTool(name, args) {
  switch (name) {
    case 'get_weather':
      return {
        city: args.city,
        temperature: 22,
        condition: 'sunny',
        humidity: 65
      };
    case 'rag_search':
      try{
        const resp = await Chat(args.query, "")
        return {
          result: resp
        };      
      }catch(e){
        console.log(e)
        return {
          result: ""
        };      
      }
    
    default:
      throw new Error(`ツールが見つかりません: ${name}`);
  }
}

/**
*
* @param
*
* @return
*/
export async function POST(req: Request) {
  const retObj = {ret: 500, data: null}
  const reqJson = await req.json();
  const jsonrpc = reqJson.jsonrpc;
  const method = reqJson.method;
  const params = reqJson.params;
  const id = reqJson.id;
  try{  
    console.log(reqJson);
    // JSON-RPC 2.0 バージョンチェック
    if (jsonrpc !== '2.0') {
      return NextResponse.json( {
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request'
        },
        id: id || null
      });
    }
    let result;

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'nextjs-mcp-server-6',
            version: '1.0.0'
          }
        };
        break;

      case 'tools/list':
        result = { tools };
        break;

      case 'tools/call':
        const { name, arguments: args } = params;
        const toolResult = await executeTool(name, args || {});
        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(toolResult, null, 2)
            }
          ]
        };
        break;

      case 'ping':
        result = { status: 'ok' };
        break;

      default:
        return NextResponse.json( {
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: 'Method not found'
          },
          id
        });
    }

    return NextResponse.json( {
      jsonrpc: '2.0',
      result,
      id
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      },
      //@ts-ignore
      id
    });
  }
}
