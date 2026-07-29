import { FlashcardStatus } from '@prisma/client';

import { documentService } from '../services/document.service.js';
import flashcardService from '../services/flashcard.service.js';
import llmService from '../services/llm.service.js';
import s3Service from '../services/s3.service.js';

export const processFlashcardJob = async (job) => {
  const { flashcardSetId, documentId } = job.data;

  try {
    // Mark as processing
    await flashcardService.updateFlashCardSet({
      flashcardSetId,
      data: {
        status: FlashcardStatus.PROCESSING,
      },
    });

    // Get document
    const document = await documentService.getDocumentByIdInternal({
      params: {
        documentId,
      },
    });

    // Read document text
    const documentText = await s3Service.getText(document.textKey);

    // Generate flashcards
    const { title, description, flashcards } = await llmService.generateFlashcards({
      document: documentText,
    });

    // Store flashcards
    await flashcardService.createFlashCard({
      flashcardSetId,
      data: flashcards,
    });

    // Mark completed
    await flashcardService.updateFlashCardSet({
      flashcardSetId,
      data: {
        title,
        description,
        status: FlashcardStatus.COMPLETED,
      },
    });
  } catch (error) {
    await flashcardService.updateFlashCardSet({
      flashcardSetId,
      data: {
        status: FlashcardStatus.FAILED,
      },
    });

    throw error;
  }
};
