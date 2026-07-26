import llmService from './llm.service.js';

class GuardrailService {
  #SCORE_THRESHOLD = 0.35;
  async validate({ query, chunks }) {
    if (!chunks.length) {
      return {
        allowed: false,
        reason: 'No relevant documents found.',
      };
    }
    const highestScore = Math.max(...chunks.map((chunk) => chunk.score));

    if (highestScore < this.#SCORE_THRESHOLD) {
      return {
        allowed: false,
        reason: 'Question is unrelated to uploaded documents.',
      };
    }
    const classification = await llmService.classify({
      query,
      chunks,
    });

    return classification;
  }
}

export default new GuardrailService();
