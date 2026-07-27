import { z } from 'zod';

export const PodcastParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['host', 'expert']),
});

export const PodcastSegmentSchema = z.object({
  id: z.string(),

  speaker: z.string(),

  intent: z.enum([
    'hook',
    'intro',
    'reaction',
    'ask',
    'follow_up',
    'story',
    'example',
    'analogy',
    'explain',
    'challenge',
    'reflection',
    'transition',
    'summary',
    'conclusion',
  ]),

  text: z.string().min(1),
});

export const PodcastChapterSchema = z.object({
  id: z.string(),

  title: z.string(),

  summary: z.string(),

  estimatedDurationSeconds: z.number().int().positive(),

  segments: z.array(PodcastSegmentSchema).min(1),
});

export const PodcastSchema = z.object({
  title: z.string(),

  description: z.string(),

  language: z.string().default('en'),

  estimatedDurationSeconds: z.number().int().positive(),

  participants: z.array(PodcastParticipantSchema).length(2),

  chapters: z.array(PodcastChapterSchema).min(1),
});
