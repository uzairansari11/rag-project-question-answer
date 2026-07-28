import { Router } from 'express';
import { documentController } from '../controllers/document.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadDocument } from '../middlewares/upload.middleware.js';

const router = Router();

router.post(
  '/upload',
  authenticate,
  uploadDocument.single('document'),
  documentController.uploadDocument,
);

router.get('/', authenticate, documentController.getDocuments);

router.get('/:documentId', authenticate, documentController.getDocument);

router.patch('/:documentId', authenticate, documentController.updateDocument);

router.delete('/:documentId', authenticate, documentController.deleteDocument);

export default router;
