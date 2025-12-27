import {QdrantClient} from '@qdrant/js-client-rest';

// TO connect to Qdrant running locally
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

const COLLECT_NAME = "sample_collection"
const EMBED_SIZE = 3072 

await client.createCollection(COLLECT_NAME, {
  vectors: {
    size: EMBED_SIZE,        // embedding の次元数
    distance: "Cosine" // Cosine / Dot / Euclid
  },
});
