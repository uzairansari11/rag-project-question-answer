import { FlashcardStatus } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { flashCardQueue } from '../queues/flashcard.queue.js';
import { ApiError } from '../utils/api-error.js';

class FlashcardService {
  async createFlashcardSet(data) {
    return prisma.flashcardSet.create({
      data,
    });
  }

  async createFlashCard({ flashcardSetId, data }) {
    const flashCards = data.map((flashcard) => ({
      flashcardSetId,
      question: flashcard.question,
      answer: flashcard.answer,
    }));

    return await prisma.flashcard.createMany({ data: flashCards });
  }
  async generate({ documentId, userId, title, topic }) {
    if (!documentId) {
      throw new ApiError(400, 'Please select a valid document to generate flashcards.');
    }

    const document = await prisma.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw new ApiError(404, 'Selected document not found or access is unauthorized.');
    }

    const cleanTitle = title?.trim() || `${document.title} - Flashcards`;

    const flashcardSet = await this.createFlashcardSet({
      documentId,
      title: cleanTitle,
      status: FlashcardStatus.PROCESSING,
    });

    await flashCardQueue.add('flash-card', {
      flashcardSetId: flashcardSet.id,
      documentId,
      topic: topic?.trim() || undefined,
    });

    return flashcardSet;
  }

  async updateFlashCardSet({ flashcardSetId, data }) {
    const cardSet = await prisma.flashcardSet.update({
      where: {
        id: flashcardSetId,
      },
      data,
    });

    return cardSet;
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
      throw new ApiError(404, 'Flashcard set not found.');
    }

    return flashcardSet;
  }

  async deleteSet(flashcardSetId, userId) {
    const flashcardSet = await prisma.flashcardSet.findFirst({
      where: {
        id: flashcardSetId,
        document: {
          userId,
        },
      },
    });

    if (!flashcardSet) {
      throw new ApiError(404, 'Flashcard set not found or access unauthorized.');
    }

    await prisma.flashcardSet.delete({
      where: {
        id: flashcardSetId,
      },
    });

    return true;
  }
}

export default new FlashcardService();
