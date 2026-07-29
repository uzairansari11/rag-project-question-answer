import flashcardService from '../services/flashcard.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

export const generateFlashCard = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { title } = req.body || {};

  const flashcard = await flashcardService.generate({
    documentId,
    userId: req.user.id,
    title,
  });

  successResponse({
    res,
    status: 202,
    message: 'Flashcards generated successfully.',
    data: flashcard,
  });
});

export const getFlashCards = asyncHandler(async (req, res) => {
  const flashcards = await flashcardService.getAll(req.user.id);

  successResponse({
    res,
    status: 200,
    message: 'Flashcard sets fetched successfully.',
    data: flashcards,
  });
});

export const getFlashCard = asyncHandler(async (req, res) => {
  const { flashcardSetId } = req.params;

  const flashcard = await flashcardService.getFlashcard(flashcardSetId, req.user.id);

  successResponse({
    res,
    status: 200,
    message: 'Flashcard set fetched successfully.',
    data: flashcard,
  });
});

export const deleteFlashCard = asyncHandler(async (req, res) => {
  const { flashcardSetId } = req.params;

  await flashcardService.deleteSet(flashcardSetId, req.user.id);

  successResponse({
    res,
    status: 200,
    message: 'Flashcard set deleted successfully.',
    data: null,
  });
});
