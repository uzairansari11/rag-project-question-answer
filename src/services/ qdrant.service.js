import qdrant from '../config/qdrant.js';

class QdrantService {
  #toPoints(embeddings) {
    return embeddings.map((embedding) => {
      return {
        id: embedding.id,
        vector: embedding.vector,
        payload: {
          text: embedding.pageContent,
          ...embedding.metadata,
        },
      };
    });
  }
  async createCollection() {
    try {
      const checkCollection = await qdrant.getCollection(process.env.QDRANT_COLLECTION);
      console.log('Collection already exists.');
      return;
    } catch (error) {
      await qdrant.createCollection(process.env.QDRANT_COLLECTION, {
        vectors: {
          distance: 'Cosine',
          size: 1536,
        },
      });

      console.log('Collection created.');
    }
  }

  async upsertEmbedding(embedding) {
    const points = this.#toPoints(embedding);
    console.log('points is here', points[0]);

    await qdrant.upsert(process.env.QDRANT_COLLECTION, {
      wait: true,
      points,
    });
  }
}

export default new QdrantService();
