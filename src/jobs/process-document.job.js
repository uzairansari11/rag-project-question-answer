import EmbeddingService from '../services/ embedding.service.js';
import chunkService from '../services/chunk.service.js';
import documentService from '../services/document.service.js';
import pdfService from '../services/pdf.service.js';
import s3Service from '../services/s3.service.js';

export async function processDocumentJob(job) {
  const { documentId, userId, fileName } = job.data;

  const file = await documentService.getDocumentById(documentId);

  const pdfBuffer = await s3Service.getFile(file.storageKey);

  const documents = await pdfService.extractText(pdfBuffer, {
    userId,
    documentId,
    fileName,
  });

  const chunks = await chunkService.splitDocuments(documents);

  const embeddings = await EmbeddingService.generateEmbeddings(chunks);

  console.log(embeddings);
}
