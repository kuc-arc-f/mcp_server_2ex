import {QdrantClient} from '@qdrant/js-client-rest';

// TO connect to Qdrant running locally
const client = new QdrantClient({url: 'http://127.0.0.1:6333'});

const COLLECT_NAME = "document-3"

const info = await client.getCollection(COLLECT_NAME);

console.log("count="+ info.points_count);

