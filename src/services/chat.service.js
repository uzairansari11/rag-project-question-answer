import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/api-error.js';
import contextService from './context.service.js';
import llmService from './llm.service.js';
import retrievalService from './retrieval.service.js';

class ChatService {
  async createChat(userId, payload) {
    return await prisma.$transaction(async (tx) => {
      if (!payload.documentIds?.length) {
        throw new ApiError('Please select at least one document.', 400);
      }
      const documents = await tx.document.findMany({
        where: {
          id: {
            in: payload.documentIds,
          },
          userId,
        },
      });

      if (documents.length !== payload.documentIds.length) {
        throw new ApiError('One or more selected documents are invalid.', 400);
      }
      const response = await tx.chat.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          title: payload.title ?? 'Untitled Chat',
          chatDocuments: {
            create: payload.documentIds.map((documentId) => {
              return {
                document: {
                  connect: {
                    id: documentId,
                  },
                },
              };
            }),
          },
        },
      });
      return response;
    });
  }

  async getChats(userId) {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        isPinned: true,
      },
    });

    return chats;
  }
  async getChat(userId, chatId) {
    const chats = await prisma.chat.findFirstOrThrow({
      where: {
        userId,
        id: chatId,
      },
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return chats;
  }
  async deleteChat(userId, chatId) {
    const chats = await prisma.chat.delete({
      where: {
        userId,
        id: chatId,
      },
    });

    return chats;
  }
  async updateChat(userId, chatId, payload) {
    const chat = await prisma.chat.update({
      where: {
        userId,
        id: chatId,
      },
      data: payload,
    });

    return chat;
  }
  async chat({ query, userId }) {
    // Retrieve relevant chunks
    const chunks = await retrievalService.retrieve({
      query,
      userId,
    });

    // Build prompt context
    const context = contextService.build(chunks);

    // Generate answer
    const answer = await llmService.generate({
      query,
      context,
    });

    return {
      answer,
      sources: chunks,
    };
  }
}

export default new ChatService();
