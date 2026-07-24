import documentService from '../services/document.service.js';
import pdfService from '../services/pdf.service.js';
import s3Service from '../services/s3.service.js';

export async function processDocumentJob(job) {
  const { documentId, userId, fileName } = job.data;

  const document = await documentService.getDocumentById(documentId);

  const pdfBuffer = await s3Service.getFile(document.storageKey);

  const extractedChunks = await pdfService.extractText(pdfBuffer, {
    userId,
    documentId,
    fileName,
  });

  console.log(extractedChunks);

  console.log(pdfBuffer instanceof Buffer);

  console.log(pdfBuffer.length);
}
