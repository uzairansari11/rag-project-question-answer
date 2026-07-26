// collection.validation.js

import { z } from 'zod';

export const getCollectionsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({}),
});

export const getCollectionSchema = z.object({
  body: z.object({}),
  params: z.object({
    collectionId: z.uuid(),
  }),
  query: z.object({}),
});
export const createCollectionSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, 'Title must be at least 3 characters').max(100),

    description: z.string().trim().max(500).optional(),
  }),

  params: z.object({}),
  query: z.object({}),
});

export const updateCollectionSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3).max(100),
    description: z.string().trim().max(500).optional(),
  }),

  params: z.object({
    collectionId: z.uuid(),
  }),

  query: z.object({}),
});

export const deleteCollectionSchema = z.object({
  body: z.object({}),

  params: z.object({
    collectionId: z.uuid(),
  }),

  query: z.object({}),
});
