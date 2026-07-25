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
      return;
    } catch (error) {
      await qdrant.createCollection(process.env.QDRANT_COLLECTION, {
        vectors: {
          distance: 'Cosine',
          size: 1536,
        },
      });
    }
  }

  async upsertEmbedding(embedding) {
    const points = this.#toPoints(embedding);

    await qdrant.upsert(process.env.QDRANT_COLLECTION, {
      wait: true,
      points,
    });
  }

  async search({ query, filter = {}, limit = 10 }) {
    const response = await qdrant.query(process.env.QDRANT_COLLECTION, {
      query: vector,
      limit,
      with_payload: true,
      filter: {
        must: [
          {
            key: 'userId',
            match: {
              value: filter.userId,
            },
          },
        ],
      },
    });
    return response.points;
  }
}

export default new QdrantService();
