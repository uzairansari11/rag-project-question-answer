import { cohere } from '../config/cohere.js';

class ReRankingService {
  async rerank({ query, chunks, topN = 10 }) {
    const documents = chunks.map((chunk) => chunk.payload.text);

    const response = await cohere.rerank({
      model: 'rerank-v3.5',
      query,
      documents,
      topN,
    }); // [ {index:3,relevanceScore:0.92}]

    return response.results.map((result) => {
      return {
        ...chunks[result.index],
        rerankScore: result.relevanceScore,
      };
    });
  }
}

export default new ReRankingService();
