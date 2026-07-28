import { Router } from 'express';
import { generatePodcast, getPodcast, getPodcasts } from '../controllers/podcast.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/:documentId/podcast', authenticate, generatePodcast);

router.get('/podcasts', authenticate, getPodcasts);
router.get('/podcasts/:podcastId', authenticate, getPodcast);

export default router;
