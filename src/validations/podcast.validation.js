import { z } from 'zod';

const podcastIdParam = z.object({
  podcastId: z.string().uuid('Invalid podcast id'),
});

const documentIdParam = z.object({
  documentId: z.string().uuid('Invalid document id'),
});

export const generatePodcastSchema = z.object({
  params: documentIdParam,
});

export const getPodcastsSchema = z.object({
  params: z.object({}),
  body: z.object({}),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().trim().optional(),
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
    sortBy: z.enum(['createdAt', 'title', 'updatedAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
  }),
});

export const getPodcastSchema = z.object({
  params: podcastIdParam,
});

export const updatePodcastSchema = z.object({
  params: podcastIdParam,
  body: z.object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(5000).optional(),
    language: z.string().trim().min(2).max(10).optional(),
  }),
});

export const deletePodcastSchema = z.object({
  params: podcastIdParam,
});
