import { UserRole } from '@prisma/client';
import crypto from 'node:crypto';
import prisma from '../lib/prisma.js';
import { documentSelect } from '../selects/document.select.js';
import { ApiError } from '../utils/api-error.js';
import s3Service from './s3.service.js';

class DocumentService {
  async uploadDocument({ user, file, payload }) {
    const documentId = crypto.randomUUID();

    const uploadedFile = await s3Service.uploadFile(documentId, file);

    try {
      return prisma.document.create({
        data: {
          id: documentId,
          title: payload.title,
          collectionId: payload.collectionId,
          userId: user.id,
          fileName: uploadedFile.fileName,
          storageKey: uploadedFile.key,
          mimeType: uploadedFile.mimeType,
          fileSize: uploadedFile.fileSize,
          status: 'PROCESSING',
        },
      });
    } catch (error) {
      await s3Service.deleteFile(uploadedFile.key);
      throw error;
    }
  }

  async getDocuments({ user }) {
    const where = user.role === UserRole.ADMIN ? {} : { userId: user.id };

    return prisma.document.findMany({
      where,
      select: documentSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getDocumentById({ user, params }) {
    const where =
      user.role === UserRole.ADMIN
        ? { id: params.documentId }
        : {
            id: params.documentId,
            userId: user.id,
          };

    const document = await prisma.document.findFirst({
      where,
    });

    if (!document) {
      throw new ApiError(404, 'Document not found.');
    }

    return document;
  }

  async updateDocument({ user, params, payload }) {
    const document = await this.getDocumentById({
      user,
      params,
    });

    return prisma.document.update({
      where: {
        id: document.id,
      },
      data: payload,
    });
  }

  async deleteDocument({ user, params }) {
    const document = await this.getDocumentById({
      user,
      params,
    });

    await s3Service.deleteFile(document.storageKey);

    await prisma.document.delete({
      where: {
        id: document.id,
      },
    });
  }

  async updateDocumentStatus({ params, payload }) {
    return prisma.document.update({
      where: {
        id: params.documentId,
      },
      data: payload,
    });
  }

  /*  */
  async getDocumentByIdInternal({ params }) {
    const document = await prisma.document.findUnique({
      where: {
        id: params.documentId,
      },
    });

    if (!document) {
      throw new ApiError(404, 'Document not found.');
    }

    return document;
  }

  async updateDocumentStatus({ params, payload }) {
    return prisma.document.update({
      where: {
        id: params.documentId,
      },
      data: payload,
    });
  }
}

export const documentService = new DocumentService();
