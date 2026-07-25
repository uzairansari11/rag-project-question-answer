import qdrant from './config/qdrant.js';
import "dotenv/config"
async function test (){
  const collection = await qdrant.getCollection(process.env.QDRANT_COLLECTION);

  console.log(process.env.QDRANT_COLLECTION);
}

test()
