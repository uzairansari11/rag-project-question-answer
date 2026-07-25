import "dotenv/config"
import { QdrantClient } from '@qdrant/js-client-rest';

export const qdrant = new QdrantClient({
  apiKey: process.env.QDRANT_API_KEY,
  url: process.env.QDRANT_URL,

});

export default qdrant;
