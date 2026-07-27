import { Router } from 'express';
import { generatePodcast, getPodcasts } from '../controllers/podcast.controller.js';

const router = Router();

router.post('/:documentId/podcast', generatePodcast);

router.get('/podcasts', getPodcasts);

export default router;
