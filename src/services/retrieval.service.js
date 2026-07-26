import embeddingService from './embedding.service.js';
import qdrantService from './qdrant.service.js';
import queryService from './query.service.js';
import rerankService from './rerank.service.js';

class RetrievalService {
  async retrieve({ query, userId, documentIds }) {
    const processedQuery = await queryService.process(query);

    console.log('processedQuery', processedQuery);
    const queries = [
      processedQuery.rewrittenQuery,
      processedQuery.stepBackQuery,
      ...processedQuery.subQueries,
    ];

    const embeddings = await Promise.all(
      queries.map((query) => embeddingService.generateQueryEmbedding(query)),
    );

    const searchResults = await Promise.all(
      embeddings.map((embedding) =>
        qdrantService.search({
          query: embedding,
          filter: {
            userId,
            documentIds,
          },
        }),
      ),
    );

    const chunks = searchResults.flat();

    const uniqueChunks = [...new Map(chunks.map((chunk) => [chunk.id, chunk])).values()];

    uniqueChunks.sort((a, b) => b.score - a.score);

    // Take the best vector search candidates
    const candidates = uniqueChunks.slice(0, 20);

    // Rerank using the original user query
    const rerankChunks = await rerankService.rerank({
      query,
      chunks: candidates,
    });

    // Return the final context
    return rerankChunks.slice(0, 10);
  }
}

export default new RetrievalService();
