// answer.prompt.js

export function buildAnswerPrompt({ question, context }) {
  return `
Question:
${question}

Context:
${context}

Instructions:
- Answer the question using ONLY the provided context.
- If the answer cannot be found in the context, say:
  "I couldn't find enough information in the available documents to answer that."
- Do not make up information.
- If the context contains conflicting information, mention the conflict.
`;
}
