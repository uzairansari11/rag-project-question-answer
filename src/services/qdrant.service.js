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

    console.log(`✅ Upserted ${points.length} embeddings.`);
  }

  async search({ query, filter = {}, limit = 10 }) {
    console.log('\n========== QDRANT SEARCH ==========');

    console.log('Vector Length:', query.length);
    console.log('User ID:', filter.userId);
    console.log('Document IDs:', filter.documentIds);

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

    console.dir(request, { depth: null });

    try {
      const response = await qdrant.query(process.env.QDRANT_COLLECTION, request);

      console.log(`✅ Found ${response.points.length} matching chunks.`);

      return response.points;
    } catch (error) {
      console.log('\n========== QDRANT ERROR ==========');

      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('URL:', error.url);
      console.dir(error.data, { depth: null });

      throw error;
    }
  }
}

export default new QdrantService();
