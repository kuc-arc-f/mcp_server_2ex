# mcp_cli_5

 Version: 0.9.1

 Author  : 

 date    : 2025/10/25
  
 update  : 

***

MCP host + GoLang MCP Server

***
### MCP Server

https://github.com/kuc-arc-f/golang_2ex/tree/main/mcp_4

***
* .env

```
GOOGLE_GENERATIVE_AI_API_KEY=
USER_NAME="user123@example.com"
PASSWORD="123"
```

***
* dev-start
```
npm run build
npm run dev
```

***
* vercel.json
```
{
  "version": 2,
  "public": true,
  "builds": [
    {
      "src": "public/**/*",
      "use": "@vercel/static"
    },        
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    {
      "src": "/.*",
      "dest": "/dist/index.js"
    }
  ]
}

```

***
### blog 