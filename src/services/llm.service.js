import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';
import openai from '../config/openai.js';
import { buildAnswerPrompt } from '../prompt/answer.prompt.js';
import { GUARDRAIL_PROMPT } from '../prompt/input-guardrail.prompt.js';
import { SYSTEM_PROMPT } from '../prompt/system.prompt.js';

const GuardrailSchema = z.object({
  allowed: z.boolean(),
  reason: z.string(),
});
class LLMService {
  #model = 'gpt-4.1-mini';

  async generate({ query, context }) {
    const prompt = buildAnswerPrompt({
      question: query,
      context,
    });

    return await openai.chat.completions.create({
      model: this.#model,
      stream: true,
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
  }

  async #generate({ prompt, query, schema, schemaName }) {
    const response = await openai.chat.completions.parse({
      model: this.#model,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      response_format: zodResponseFormat(schema, schemaName),
    });

    return response.choices[0].message.parsed;
  }

  async classify({ query, chunks }) {
    const context = chunks
      .map(
        (chunk, index) => `
                  Chunk ${index + 1}
                  ${chunk.payload.text}
                  `,
      )
      .join('\n\n');

    return this.#generate({
      prompt: GUARDRAIL_PROMPT,
      query: `
              User Question:
              ${query}

              Retrieved Context:
              ${context}
              `,
      schema: GuardrailSchema,
      schemaName: 'GuardrailResponse',
    });
  }
}

export default new LLMService();
