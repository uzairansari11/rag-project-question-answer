import express from 'express';
import {
  createCollection,
  deleteCollection,
  getCollection,
  getCollections,
  updateCollection,
} from '../controllers/collection.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createCollectionSchema,
  deleteCollectionSchema,
  getCollectionSchema,
  getCollectionsSchema,
  updateCollectionSchema,
} from '../validations/collection.validation.js';
// collection.route.js
const router = express.Router();

router.get('/', authenticate, validate(getCollectionsSchema), getCollections);

router.post('/', authenticate, validate(createCollectionSchema), createCollection);

router.patch('/:collectionId', authenticate, validate(updateCollectionSchema), updateCollection);

router.delete('/:collectionId', authenticate, validate(deleteCollectionSchema), deleteCollection);

router.get('/:collectionId', authenticate, validate(getCollectionSchema), getCollection);

export default router;
