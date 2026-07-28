import { UserRole } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { collectDetailSelect, collectionSelect } from '../selects/collection.select.js';
import { documentSelect } from '../selects/document.select.js';
import { ApiError } from '../utils/api-error.js';

class CollectionService {
  async getCollections({ user }) {
    const where = user.role === UserRole.ADMIN ? {} : { userId: user.id };

    return prisma.collection.findMany({
      where,
      select: collectionSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCollection({ user, params }) {
    const where =
      user.role === UserRole.ADMIN
        ? { id: params.collectionId }
        : {
            id: params.collectionId,
            userId: user.id,
          };

    const collection = await prisma.collection.findFirst({
      where,
      select: {
        ...collectDetailSelect,
        documents: {
          select: documentSelect,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!collection) {
      throw new ApiError(404, 'Collection not found');
    }

    return collection;
  }

  async createCollection({ user, payload }) {
    const { title, description } = payload;

    const existingCollection = await prisma.collection.findFirst({
      where: {
        userId: user.id,
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
        userId: user.id,
      },
      select: {
        ...collectDetailSelect,
        documents: {
          select: documentSelect,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async updateCollection({ user, params, payload }) {
    const where =
      user.role === UserRole.ADMIN
        ? { id: params.collectionId }
        : {
            id: params.collectionId,
            userId: user.id,
          };

    const collection = await prisma.collection.findFirst({
      where,
    });

    if (!collection) {
      throw new ApiError(404, 'Collection not found');
    }

    return prisma.collection.update({
      where: {
        id: collection.id,
      },
      data: payload,
      select: collectDetailSelect,
    });
  }

  async deleteCollection({ user, params }) {
    const where =
      user.role === UserRole.ADMIN
        ? { id: params.collectionId }
        : {
            id: params.collectionId,
            userId: user.id,
          };

    const collection = await prisma.collection.findFirst({
      where,
    });

    if (!collection) {
      throw new ApiError(404, 'Collection not found');
    }

    await prisma.collection.delete({
      where: {
        id: collection.id,
      },
    });
  }
}

export const collectionService = new CollectionService();
