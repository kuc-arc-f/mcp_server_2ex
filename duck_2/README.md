# duck_2

 Version: 0.9.1

 Author  : 

 date    : 2026/01/09
  
 update  : 

***

RAG search , DuckDb example

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
* vector data add
```
npx tsx src/embed.ts
```

***
* RAG Search

```
npx tsx src/index.ts
```

***
### blog 