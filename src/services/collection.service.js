// collection.service.js

import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/api-error.js';

const documentSelect = {
  id: true,
  title: true,
  fileName: true,
  status: true,
  collectionId: true,
  createdAt: true,
  updatedAt: true,
};

class CollectionService {
  async getCollections(userId) {
    return prisma.collection.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            documents: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCollection(userId, collectionId) {
    return prisma.collection.findFirst({
      where: {
        userId,
        id: collectionId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        documents: {
          select: documentSelect,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async createCollection(userId, payload) {
    const { title, description } = payload;

    const existingCollection = await prisma.collection.findFirst({
      where: {
        userId,
        title,
      },
    });

    if (existingCollection) {
      throw new ApiError(409, 'Collection with this title already exists');
    }

    return prisma.collection.create({
      data: {
        title,
        description,
        userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        documents: {
          select: documentSelect,
        },
      },
    });
  }

  async updateCollection(userId, collectionId, payload) {
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      throw new ApiError(404, 'Collection not found');
    }

    return prisma.collection.update({
      where: {
        id: collectionId,
      },
      data: payload,
      select: {
        id: true,
        title: true,
        description: true,
        updatedAt: true,
      },
    });
  }
  async deleteCollection(userId, collectionId) {
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      throw new ApiError(404, 'Collection not found');
    }

    await prisma.collection.delete({
      where: {
        id: collectionId,
      },
    });
  }
}

export default new CollectionService();
