import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import { QUERY_REWRITE_PROMPT, STEP_BACK_PROMPT, SUB_QUERY_PROMPT } from '../prompts/index.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// =====================
// Private Schemas
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
    const response = await openai.responses.parse({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      text: {
        format: zodResponseFormat(schema, schemaName),
      },
    });

    return response.output_parsed;
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
