import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    message: z
      .string()
      .trim()
      .min(1, 'Message is required.')
      .max(5000, 'Message cannot exceed 5000 characters.'),
  }),

  params: z.object({
    chatId: z.uuid({
      message: 'Invalid chat ID.',
    }),
  }),

  query: z.object({}),
});
