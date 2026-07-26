// Send Message Service function

import { MessageRole } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/api-error.js';
import contextService from './context.service.js';
import guardrailService from './guardrail.service.js';
import llmService from './llm.service.js';
import retrievalService from './retrieval.service.js';

class MessageService {
  async sendMessage(userId, chatId, payload) {
    const chat = await this.validateChat(userId, chatId);

    const userMessage = await this.createUserMessage(chat.id, payload.message);

    const documentIds = await this.getChatDocuments(chat.id);

    const chunks = await retrievalService.retrieve({
      query: payload.message,
      documentIds,
      userId,
      limit: 10,
    });
    const guardrail = await guardrailService.validate({
      query: payload.message,
      chunks,
    });
    if (!guardrail.allowed) {
      await this.createAssistantMessage(chat.id, guardrail.reason);
      return {
        stream: null,
        sources: [],
        message: guardrail.reason,
        type: 'guardrail',
      };
    }
    const context = contextService.build(chunks);

    const stream = await llmService.generate({
      query: payload.message,
      context,
    });

    return {
      stream,
      sources: chunks.map((chunk) => ({
        fileName: chunk.payload.fileName,
        page: chunk.payload.page,
      })),
    };
  }

  async validateChat(userId, chatId) {
    const chat = await prisma.chat.findUnique({
      where: {
        userId,
        id: chatId,
      },
    });

    if (!chat) {
      throw new ApiError('Chat not found.', 404);
    }

    return chat;
  }

  async createUserMessage(chatId, message) {
    const userMessage = await prisma.message.create({
      data: {
        role: MessageRole.USER,
        content: message,
        chat: {
          connect: {
            id: chatId,
          },
        },
      },
    });

    return userMessage;
  }

  async getChatDocuments(chatId) {
    const chatDocuments = await prisma.chatDocument.findMany({
      where: {
        chatId: chatId,
      },
      select: {
        documentId: true,
      },
    });
    return chatDocuments.map((doc) => doc.documentId);
  }

  async getChatHistory(chatId) {
    return prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        role: true,
        content: true,
      },
    });
  }
  async createAssistantMessage(chatId, content) {
    return prisma.message.create({
      data: {
        role: MessageRole.ASSISTANT,
        content,
        chat: {
          connect: {
            id: chatId,
          },
        },
      },
    });
  }
}

export default new MessageService();
