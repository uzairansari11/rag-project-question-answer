import messageService from '../services/message.service.js';
import { asyncHandler } from '../utils/async.handler.js';

export const sendMessage = asyncHandler(async (req, res) => {
  // SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.flushHeaders?.();

  const { stream, sources, type, message } = await messageService.sendMessage(
    req.user.id,
    req.params.chatId,
    req.body,
  );

  // Guardrail Response
  if (type === 'guardrail') {
    await messageService.createAssistantMessage(req.params.chatId, message);

    res.write(
      `data: ${JSON.stringify({
        type: 'token',
        content: message,
      })}\n\n`,
    );

    res.write(
      `data: ${JSON.stringify({
        type: 'sources',
        sources: [],
      })}\n\n`,
    );

    res.write(
      `data: ${JSON.stringify({
        type: 'done',
      })}\n\n`,
    );

    return res.end();
  }

  let answer = '';

  try {
    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? '';

      if (!token) continue;

      answer += token;

      res.write(
        `data: ${JSON.stringify({
          type: 'token',
          content: token,
        })}\n\n`,
      );
    }

    await messageService.createAssistantMessage(req.params.chatId, answer);

    res.write(
      `data: ${JSON.stringify({
        type: 'sources',
        sources,
      })}\n\n`,
    );

    res.write(
      `data: ${JSON.stringify({
        type: 'done',
      })}\n\n`,
    );

    res.end();
  } catch (error) {
    res.write(
      `data: ${JSON.stringify({
        type: 'error',
        message: error.message,
      })}\n\n`,
    );

    res.end();
  }
});
