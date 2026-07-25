import contextService from './context.service.js';
import llmService from './llm.service.js';
import retrievalService from './retrieval.service.js';

class ChatService {
  async chat({ query, userId }) {
    // Retrieve relevant chunks
    const chunks = await retrievalService.retrieve({
      query,
      userId,
    });

    // Build prompt context
    const context = contextService.build(chunks);

    // Generate answer
    const answer = await llmService.generate({
      query,
      context,
    });

    return {
      answer,
      sources: chunks,
    };
  }
}

export default new ChatService();
