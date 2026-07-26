import messageService from '../services/message.service.js';
import { asyncHandler } from '../utils/async.handler.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const { stream, sources } = await messageService.sendMessage(
    req.user.id,
    req.params.chatId,
    req.body,
  );

  // SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Flush headers immediately
  res.flushHeaders?.();

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

    // Save assistant response
    await messageService.createAssistantMessage(req.params.chatId, answer);

    // Send sources
    res.write(
      `data: ${JSON.stringify({
        type: 'sources',
        sources,
      })}\n\n`,
    );

    // Notify completion
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
