// chat.validation.js

import { z } from 'zod';

export const getChatsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});

export const createChatSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100).optional(),

    documentIds: z
      .array(z.uuid())
      .min(1, 'Please select at least one document.')
      .refine((ids) => new Set(ids).size === ids.length, 'Duplicate document IDs are not allowed.'),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const getChatSchema = z.object({
  body: z.object({}),

  params: z.object({
    chatId: z.uuid(),
  }),

  query: z.object({}),
});

export const deleteChatSchema = z.object({
  body: z.object({}),

  params: z.object({
    chatId: z.uuid(),
  }),

  query: z.object({}),
});

export const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().trim().min(1, 'Message is required.').max(5000),
  }),

  params: z.object({
    chatId: z.uuid(),
  }),

  query: z.object({}),
});
