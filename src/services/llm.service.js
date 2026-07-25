import openai from '../config/openai.js';
import { buildAnswerPrompt } from '../prompt/answer.prompt.js';
import { SYSTEM_PROMPT } from '../prompt/system.prompt.js';

class LLMService {
  #model = 'gpt-4.1-mini';

  async generate({ query, context }) {
    const prompt = buildAnswerPrompt({
      question: query,
      context,
    });

    const response = await openai.chat.completions.create({
      model: this.#model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0,
    });

    return response.choices[0].message.content;
  }
}

export default new LLMService();
