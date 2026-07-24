import crypto from 'node:crypto';
import openai from '../config/openai.js';

class EmbeddingService {
  async generateEmbeddings(chunks) {
    const texts = chunks.map((chunk) => chunk.pageContent);

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
    });

    return response.data.map((data, index) => {
      const chunk = chunks[index];

      return {
        id: crypto.randomUUID(),
        vector: data.embedding,
        pageContent: chunk.pageContent,
        metadata: chunk.metadata,
      };
    });
  }
}

export default new EmbeddingService();
