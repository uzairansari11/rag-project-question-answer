import { JOB_NAMES } from '../constants/queue.constants.js';
import { documentQueue } from '../queues/document.queue.js';
import documentService from '../services/document.service.js';
import { asyncHandler } from '../utils/async.handler.js';

export const uploadDocumentController = asyncHandler(async (req, res) => {
  const result = await documentService.uploadDocument({
    file: req.file,
    body: req.body,
    userId: req.user.id,
  });

  await documentQueue.add(JOB_NAMES.PROCESS_DOCUMENT, {
    documentId: result.id,
    userId: req.user.id,
    fileName: result.fileName,
  });
  res.status(201).json({
    success: true,
    message: 'File uploaded successfully',
  });
});
