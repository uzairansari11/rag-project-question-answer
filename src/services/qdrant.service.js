import qdrant from '../config/qdrant.js';

class QdrantService {
  #toPoints(embeddings) {
    return embeddings.map((embedding) => ({
      id: embedding.id,
      vector: embedding.vector,
      payload: {
        text: embedding.pageContent,
        ...embedding.metadata,
      },
    }));
  }

  async createCollection() {
    const collectionName = process.env.QDRANT_COLLECTION;

    // Create collection if it doesn't exist
    try {
      await qdrant.getCollection(collectionName);
      console.log(`✅ Collection "${collectionName}" already exists.`);
    } catch {
      console.log(`🚀 Creating collection "${collectionName}"...`);

      await qdrant.createCollection(collectionName, {
        vectors: {
          size: 1536,
          distance: 'Cosine',
        },
      });

      console.log('✅ Collection created.');
    }

    // Create userId index
  }

  async upsertEmbedding(embeddings) {
    const points = this.#toPoints(embeddings);

    await qdrant.upsert(process.env.QDRANT_COLLECTION, {
      wait: true,
      points,
    });
  }

  async search({ query, filter = {}, limit = 10 }) {
    const request = {
      query,
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
          {
            key: 'documentId',
            match: {
              any: filter.documentIds,
            },
          },
        ],
      },
    };

    try {
      const response = await qdrant.query(process.env.QDRANT_COLLECTION, request);

      return response.points;
    } catch (error) {
      throw error;
    }
  }
}

export default new QdrantService();
