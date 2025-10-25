# mcp_cli_4

 Version: 0.9.1

 Author  : 

 date    : 2025/10/24
  
 update  : 

***

MCP host + Rust MCP Server

***
### blog 


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
* images

![img1](/image/mcp_cli_4.png)

***
### blog 

https://zenn.dev/knaka0209/scraps/4be37f5db128f0
