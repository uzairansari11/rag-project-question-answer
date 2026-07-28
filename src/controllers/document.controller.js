import { JOB_NAMES } from '../constants/queue.constants.js';
import { documentQueue } from '../queues/document.queue.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

import { documentService } from '../services/document.service.js';
class DocumentController {
  uploadDocument = asyncHandler(async (req, res) => {
    const document = await documentService.uploadDocument({
      user: req.user,
      file: req.file,
      payload: req.body,
    });

    await documentQueue.add(JOB_NAMES.PROCESS_DOCUMENT, {
      documentId: document.id,
      userId: req.user.id,
      fileName: document.fileName,
    });

    return successResponse({
      res,
      status: 201,
      message: 'File uploaded successfully',
      data: document,
    });
  });

  getDocuments = asyncHandler(async (req, res) => {
    const documents = await documentService.getDocuments({
      user: req.user,
      query: req.query,
    });

    return successResponse({
      res,
      status: 200,
      data: documents,
    });
  });

  getDocument = asyncHandler(async (req, res) => {
    const document = await documentService.getDocumentById({
      user: req.user,
      params: req.params,
    });

    return successResponse({
      res,
      status: 200,
      data: document,
    });
  });

  updateDocument = asyncHandler(async (req, res) => {
    const document = await documentService.updateDocument({
      user: req.user,
      params: req.params,
      payload: req.body,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Document updated successfully',
      data: document,
    });
  });

  deleteDocument = asyncHandler(async (req, res) => {
    await documentService.deleteDocument({
      user: req.user,
      params: req.params,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Document deleted successfully',
    });
  });
}

export const documentController = new DocumentController();
