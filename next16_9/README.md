# next16_9

 Version: 0.9.1

 Author  : 

 date    : 2025/12/02 
  
 update  : 

***

next.js remote MCP Server, RAG Search

* pgvector docker
* embedding: qwen3-embedding:0.6b Ollama
* GEMINI-CLI use

***
* vector data add

https://github.com/kuc-arc-f/golang_3ex/tree/main/mcp_17

***
* Go MCP Server

https://github.com/kuc-arc-f/golang_3ex/tree/main/mcp_18

***
* dev-start
```
npm run build
npm run dev
```

***
* .env
```
PG_CONNECT_STR=postgres://root:admin@localhost:5432/mydb
```

***
* GEMINI-CLI , settings.json

```
  "mcpServers": {
      "nextjs-mcp-server-6": {
          "httpUrl": "http://localhost:3000/api/mcp"
      }
  },
```
***
* test-code: test.js

```js

const start = async function() {
  try{
      const item = {
        "jsonrpc": "2.0",
        "method": "tools/call",
        "params": {
          "name": "rag_search",
          "arguments": {
            "query": "大リーグ ドジャース",
          }
        },
        "id": 2
      }    
      const response = await fetch("http://localhost:3000/api/mcp", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'abcdef-123456',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const text = await response.text();
      console.log(text);
      throw new Error('Failed to create item');
    }else{
      console.log("OK");
      const json = await response.json();
      console.log(json);
      console.log(json.result.content[0].text);
    }
  }catch(e){console.log(e)}
}
start();

```

***
### blog 


***
