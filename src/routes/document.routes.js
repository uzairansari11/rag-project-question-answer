import { Router } from 'express';
import {
  getDocumentsController,
  uploadDocumentController,
} from '../controllers/document.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadDocument } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/upload', authenticate, uploadDocument.single('document'), uploadDocumentController);

router.get('/', authenticate, getDocumentsController);

export default router;
