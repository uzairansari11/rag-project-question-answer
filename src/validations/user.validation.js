import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters.').max(50),

    lastName: z.string().trim().max(50).optional(),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(8, 'Current password must be at least 8 characters.'),

    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
  }),

  params: z.object({}),

  query: z.object({}),
});
