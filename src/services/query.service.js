import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import { QUERY_REWRITE_PROMPT } from '../prompt/rewrite.prompt.js';
import { STEP_BACK_PROMPT } from '../prompt/step-back.prompt.js';
import { SUB_QUERY_PROMPT } from '../prompt/sub-query.prompt.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =====================
// Zod Schemas
// =====================

const RewriteSchema = z.object({
  rewrittenQuery: z.string(),
});

const StepBackSchema = z.object({
  stepBackQuery: z.string(),
});

const SubQuerySchema = z.object({
  queries: z.array(z.string()).min(1).max(5),
});

class QueryService {
  async #generate({ prompt, query, schema, schemaName }) {
    const response = await openai.chat.completions.parse({
      model: 'gpt-4.1-mini',
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

    const parsed = response.choices[0]?.message?.parsed;

    if (!parsed) {
      throw new Error('Failed to parse structured response from OpenAI.');
    }

    return parsed;
  }

  async rewrite(query) {
    const { rewrittenQuery } = await this.#generate({
      prompt: QUERY_REWRITE_PROMPT,
      query,
      schema: RewriteSchema,
      schemaName: 'rewrite_query',
    });

    return rewrittenQuery;
  }

  async generateStepBack(query) {
    const { stepBackQuery } = await this.#generate({
      prompt: STEP_BACK_PROMPT,
      query,
      schema: StepBackSchema,
      schemaName: 'step_back_query',
    });

    return stepBackQuery;
  }

  async generateSubQueries(query) {
    const { queries } = await this.#generate({
      prompt: SUB_QUERY_PROMPT,
      query,
      schema: SubQuerySchema,
      schemaName: 'sub_queries',
    });

    return queries;
  }

  async process(query) {
    const rewrittenQuery = await this.rewrite(query);

    const [stepBackQuery, subQueries] = await Promise.all([
      this.generateStepBack(rewrittenQuery),
      this.generateSubQueries(rewrittenQuery),
    ]);

    return {
      originalQuery: query,
      rewrittenQuery,
      stepBackQuery,
      subQueries,
    };
  }
}

export default new QueryService();
