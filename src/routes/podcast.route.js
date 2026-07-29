import { Router } from 'express';
import { podcastController } from '../controllers/podcast.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  deletePodcastSchema,
  generatePodcastSchema,
  getPodcastSchema,
  getPodcastsSchema,
  updatePodcastSchema,
} from '../validations/podcast.validation.js';
const router = Router();

// Protect all routes
router.use(authenticate);

router.post(
  '/generate/:documentId',
  validate(generatePodcastSchema),
  podcastController.generatePodcast,
);

router.get('/', validate(getPodcastsSchema), podcastController.getPodcasts);

router.get('/:podcastId', validate(getPodcastSchema), podcastController.getPodcast);

router.patch(
  '/:podcastId',
  validate(updatePodcastSchema),
  podcastController.updatePodcast,
);

router.delete(
  '/:podcastId',
  validate(deletePodcastSchema),
  podcastController.deletePodcast,
);

export default router;
