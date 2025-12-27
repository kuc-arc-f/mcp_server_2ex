# qdrant_2

 Version: 0.9.1

 Author  : 

 date    : 2025/12/27
  
 update  : 

***

RAG search qdrant , example

* embedding: gemini-embedding-001
* gemma3-27b

***
### setup
* .env

```
GOOGLE_GENAI_USE_VERTEXAI=FALSE
GOOGLE_API_KEY=your-key
```

***
* data path: ./data

***
* init, Collection add
```
npx tsx src/init.ts
```

* vector data add
```
npx tsx src/embed.ts
```

* RAG Search
```
npx tsx src/index.ts
```
***
### blog 