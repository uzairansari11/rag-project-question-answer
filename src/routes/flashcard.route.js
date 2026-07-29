import { Router } from 'express';
import {
  generateFlashCard,
  getFlashCard,
  getFlashCards,
  deleteFlashCard,
} from '../controllers/flashcard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate/:documentId', generateFlashCard);

router.get('/', getFlashCards);

router.get('/:flashcardSetId', getFlashCard);

router.delete('/:flashcardSetId', deleteFlashCard);

export default router;
