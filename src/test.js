import 'dotenv/config';
import qdrant from './config/qdrant.js';
async function test() {
  const collection = await qdrant.getCollection(process.env.QDRANT_COLLECTION);
  try {
    const result1 = await qdrant.createPayloadIndex(process.env.QDRANT_COLLECTION, {
      field_name: 'userId',
      field_schema: 'keyword',
    });

    console.log('userId index:', result1);

    const result2 = await qdrant.createPayloadIndex(process.env.QDRANT_COLLECTION, {
      field_name: 'documentId',
      field_schema: 'keyword',
    });

    console.log('documentId index:', result2);
  } catch (error) {
    console.dir(error, { depth: null });
  }
  console.dir(collection, { depth: null });
}

test();
