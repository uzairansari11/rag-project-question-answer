import chatService from '../services/chat.service.js';
import { asyncHandler } from '../utils/async.handler.js';

export const createChat = asyncHandler(async (req, res) => {
  const chat = await chatService.createChat(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Chat created successfully',
    data: chat,
  });
});

export const getChats = asyncHandler(async (req, res) => {
  const chats = await chatService.getChats(req.user.id);

  res.status(200).json({
    success: true,
    data: chats,
  });
});
