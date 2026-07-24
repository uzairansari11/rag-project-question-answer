import documentService from '../services/document.service.js';
import s3Service from '../services/s3.service.js';

export async function processDocumentJob(job) {
  const { documentId } = job.data;

  const document = await documentService.getDocumentById(documentId);

  const pdfBuffer = await s3Service.getFile(document.storageKey);

  console.log(pdfBuffer instanceof Buffer);

  console.log(pdfBuffer.length);
}
