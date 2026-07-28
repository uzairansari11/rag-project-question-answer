import { z } from 'zod';

export const FlashcardSchema = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

export const FlashcardsSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  flashcards: z.array(FlashcardSchema).min(1),
});
