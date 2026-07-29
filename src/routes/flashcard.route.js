import { Router } from 'express';
import {
  generateFlashCard,
  getFlashCard,
  getFlashCards,
} from '../controllers/flashcard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/generate/:documentId', authenticate, generateFlashCard);

router.get('/', authenticate, getFlashCards);

router.get('/:flashcardSetId', authenticate, getFlashCard);

export default router;
