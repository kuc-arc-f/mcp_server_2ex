// MCP Remote Server using Express.js and JSON-RPC 2.0
const express = require('express');
const bodyParser = require('body-parser');
import purchase from "./handler/purchase";
import 'dotenv/config'

const app = express();
app.use(bodyParser.json());
//console.log(process.env)
app.use('/*', function(req, res, next) {
  const apikey = process.env.API_KEY;
  const authHeader = req.headers["authorization"]
  if (apikey !== authHeader) {
    console.log("authHeader=", authHeader)
    console.log("NG, auth");
    const response = {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'error , header Authorization',
        data: ""
      },
      id: 0,
    };
    return res.json(response);
    //return res.sendStatus(400);
  }
  next();
});

// ツール定義
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
    name: 'calculate',
    description: '数値計算を実行します',
    inputSchema: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          enum: ['add', 'subtract', 'multiply', 'divide']
        },
        a: { type: 'number' },
        b: { type: 'number' }
      },
      required: ['operation', 'a', 'b']
    }
  },
  {
    name: 'purchase_add',
    description: '品名と価格を受け取り、値をAPIに送信します。',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '購入する品名'
        },
        price: {
          type: 'number',
          description: '価格'
        }
      },
      required: ['name', 'price']
    }
  },  
  {
    name: 'purchase_list',
    description: '購入品リストを、表示します。',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },  

];

// ツール実行ハンドラー
async function executeTool(name, args) {
  switch (name) {
    case 'get_weather':
      return {
        city: args.city,
        temperature: 22,
        condition: 'sunny',
        humidity: 65
      };
    
    case 'calculate':
      const { operation, a, b } = args;
      let result;
      switch (operation) {
        case 'add': result = a + b; break;
        case 'subtract': result = a - b; break;
        case 'multiply': result = a * b; break;
        case 'divide': result = a / b; break;
        default: throw new Error('不明な操作');
      }
      return { result };
    
    case 'purchase_add':
      const { name, price } = args;
      await purchase.addPurchase(name, price);
      return {
        name: name,
        price: price,
      };

    case 'purchase_list':
      const resp = await purchase.listPurchase();
      return {
        result: resp
      };      

    default:
      throw new Error(`ツールが見つかりません: ${name}`);
  }
}

// JSON-RPC 2.0 ハンドラー
async function handleJsonRpc(request) {
  const { jsonrpc, method, params, id } = request;

  // JSON-RPC 2.0 バージョンチェック
  if (jsonrpc !== '2.0') {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request'
      },
      id: id || null
    };
  }

  try {
    let result;

    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'example-mcp-server',
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
        return {
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: 'Method not found'
          },
          id
        };
    }

    return {
      jsonrpc: '2.0',
      result,
      id
    };

  } catch (error) {
    return {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      },
      id
    };
  }
}

// メインエンドポイント
app.post('/mcp', async (req, res) => {
  try {
    const response = await handleJsonRpc(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: error.message
      },
      id: req.body.id || null
    });
  }
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/mcp`);
});

module.exports = app;