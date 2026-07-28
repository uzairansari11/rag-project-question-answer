import { FlashcardStatus } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { documentService } from './document.service.js';
import llmService from './llm.service.js';
import s3Service from './s3.service.js';

class FlashcardService {
  async createFlashcardSet(data) {
    return prisma.flashcardSet.create({
      data,
    });
  }

  async generate({ documentId, userId }) {
    const document = await documentService.getDocumentById({ params: { documentId } });

    const flashcardSet = await this.createFlashcardSet({
      documentId,
      status: FlashcardStatus.PROCESSING,
    });

    const documentText = await s3Service.getText(document.textKey);

    const flashcardResponse = await llmService.generateFlashcards({
      document: documentText,
    });

    await prisma.flashcard.createMany({
      data: flashcardResponse.flashcards.map((flashcard) => ({
        flashcardSetId: flashcardSet.id,
        question: flashcard.question,
        answer: flashcard.answer,
      })),
    });

    const updatedFlashcardSet = await prisma.flashcardSet.update({
      where: {
        id: flashcardSet.id,
      },
      data: {
        title: flashcardResponse.title,
        description: flashcardResponse.description,
        status: FlashcardStatus.COMPLETED,
      },
      include: {
        flashcards: true,
      },
    });

    return updatedFlashcardSet;
  }

  async getAll(userId) {
    return prisma.flashcardSet.findMany({
      where: {
        document: {
          userId,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            flashcards: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getFlashcard(flashcardSetId, userId) {
    const flashcardSet = await prisma.flashcardSet.findFirst({
      where: {
        id: flashcardSetId,
        document: {
          userId,
        },
      },
      include: {
        flashcards: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!flashcardSet) {
      throw new AppError('Flashcard set not found.', 404);
    }

    return flashcardSet;
  }
}

export default new FlashcardService();
