import chatService from '../services/chat.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

export const createChat = asyncHandler(async (req, res) => {
  const chat = await chatService.createChat(req.user.id, req.body);

  return successResponse({
    res,
    status: 201,
    message: 'Chat created successfully',
    data: chat,
  });
});

export const getChats = asyncHandler(async (req, res) => {
  const chats = await chatService.getChats(req.user.id);

  return successResponse({
    res,
    status: 200,
    data: chats,
  });
});

export const getChat = asyncHandler(async (req, res) => {
  const chats = await chatService.getChat(req.user.id, req.params.chatId);

  return successResponse({
    res,
    status: 200,
    data: chats,
  });
});

export const updateChat = asyncHandler(async (req, res) => {
  const chat = await chatService.updateChat(req.user.id, req.params.chatId, req.body);

  return successResponse({
    res,
    status: 200,
    data: chat,
  });
});

export const deleteChat = asyncHandler(async (req, res) => {
  const chat = await chatService.deleteChat(req.user.id, req.params.chatId);

  return successResponse({
    res,
    status: 200,
    data: chat,
    message: 'Chat deleted successfully.',
  });
});
