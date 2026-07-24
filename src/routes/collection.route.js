import express from 'express';
import {
  createCollection,
  deleteCollection,
  getCollections,
  updateCollection,
} from '../controllers/collection.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createCollectionSchema,
  deleteCollectionSchema,
  getCollectionsSchema,
  updateCollectionSchema,
} from '../validations/collection.validation.js';
// collection.route.js
const router = express.Router();

router.get('/', authenticate, validate(getCollectionsSchema), getCollections);

router.post('/', authenticate, validate(createCollectionSchema), createCollection);

router.patch('/:collectionId', authenticate, validate(updateCollectionSchema), updateCollection);

router.delete('/:collectionId', authenticate, validate(deleteCollectionSchema), deleteCollection);

export default router;
