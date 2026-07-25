import messageService from '../services/message.service.js';
import { asyncHandler } from '../utils/async.handler.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const response = await messageService.sendMessage(req.user.id, req.params.chatId, req.body);

  res.status(200).json({
    success: true,
    message: 'Message sent successfully.',
    data: response,
  });
});
