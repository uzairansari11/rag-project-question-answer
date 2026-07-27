import crypto from 'node:crypto';
import prisma from '../lib/prisma.js';
import s3Service from './s3.service.js';
class DocumentService {
  async uploadDocument({ file, body, userId }) {
    const documentId = crypto.randomUUID();
    const uploadedFile = await s3Service.uploadFile(documentId, file);
    try {
      const document = await prisma.document.create({
        data: {
          id: documentId,
          title: body.title,
          collectionId: body.collectionId,
          userId,
          fileName: uploadedFile.fileName,
          storageKey: uploadedFile.key,
          mimeType: uploadedFile.mimeType,
          fileSize: uploadedFile.fileSize,
          status: 'PROCESSING',
        },
      });
      return document;
    } catch (error) {
      await s3Service.deleteFile(uploadedFile.key);

      throw error;
    }
  }
  async getDocumentById(documentId) {
    return await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });
  }
  async getDocuments(userId) {
    return await prisma.document.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        fileName: true,
        storageKey: true,
        mimeType: true,
        fileSize: true,
        errorMessage: true,
        status: true,
        processedAt: true,
        createdAt: true,
        collection: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async updateDocument(documentId, data) {
    return prisma.document.update({
      where: {
        id: documentId,
      },
      data,
    });
  }
}

export default new DocumentService();
