import {QdrantClient} from '@qdrant/js-client-rest';

// TO connect to Qdrant running locally
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

const COLLECT_NAME = "document-3"
//const EMBED_SIZE = 3

await client.deleteCollection(COLLECT_NAME);

console.log("collection deleted");

