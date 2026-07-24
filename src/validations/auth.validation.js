import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2),

    lastName: z.string().trim().optional(),

    email: z.email().trim().toLowerCase(),

    password: z.string().min(8),
  }),

  params: z.object({}),

  query: z.object({}),
});
