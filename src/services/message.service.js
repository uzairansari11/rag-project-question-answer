import { MessageRole } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/api-error.js';

class MessageService {
  async sendMessage(userId, chatId, payload) {
    return await prisma.$transaction(async (tx) => {
      // Verify chat ownership
      const chat = await tx.chat.findFirst({
        where: {
          id: chatId,
          userId,
        },
      });

      if (!chat) {
        throw new ApiError('Chat not found.', 404);
      }

      // Save user message
      const message = await tx.message.create({
        data: {
          role: MessageRole.USER,
          content: payload.message,
          chat: {
            connect: {
              id: chatId,
            },
          },
        },
      });

      return message;
    });
  }
}

export default new MessageService();
