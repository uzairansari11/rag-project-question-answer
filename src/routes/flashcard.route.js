import { Router } from 'express';
import {
  generateFlashCard,
  getFlashCard,
  getFlashCards,
} from '../controllers/flashcard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/:documentId/flashcards', authenticate, generateFlashCard);

router.get('/flashcards', authenticate, getFlashCards);

router.get('/flashcards/:flashcardSetId', authenticate, getFlashCard);

export default router;
