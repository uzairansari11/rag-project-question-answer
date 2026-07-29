import { DocumentStatus } from '@prisma/client';
import chunkService from '../services/chunk.service.js';
import { documentService } from '../services/document.service.js';
import EmbeddingService from '../services/embedding.service.js';
import pdfService from '../services/pdf.service.js';
import QdrantService from '../services/qdrant.service.js';
import s3Service from '../services/s3.service.js';

export async function processDocumentJob(job) {
  const { documentId, userId, fileName } = job.data;

  try {
    const document = await documentService.getDocumentByIdInternal({
      params: {
        documentId,
      },
    });

    const pdfBuffer = await s3Service.getFile(document.storageKey);

    const { documents, text } = await pdfService.extractText(pdfBuffer, {
      userId,
      documentId,
      fileName,
    });

    const { key: textKey } = await s3Service.uploadText(documentId, text);

    const chunks = await chunkService.splitDocuments(documents);

    const embeddings = await EmbeddingService.generateEmbeddings(chunks);

    await QdrantService.upsertEmbedding(embeddings);

    await documentService.updateDocumentStatus({
      params: {
        documentId,
      },
      payload: {
        textKey,
        status: DocumentStatus.COMPLETED,
        errorMessage: null,
      },
    });
  } catch (error) {
    await documentService.updateDocumentStatus({
      params: {
        documentId,
      },
      payload: {
        status: DocumentStatus.FAILED,
        errorMessage: error.message,
      },
    });

    throw error;
  }
}
