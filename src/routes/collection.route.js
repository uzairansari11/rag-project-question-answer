import express from 'express';
import { collectionController } from '../controllers/collection.controller.js';
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

router.use(authenticate);

collectionController;

router.get('/', validate(getCollectionsSchema), collectionController.getCollections);

router.post('/', validate(createCollectionSchema), collectionController.createCollection);

router.patch(
  '/:collectionId',
  validate(updateCollectionSchema),
  collectionController.updateCollection,
);

router.delete(
  '/:collectionId',
  validate(deleteCollectionSchema),
  collectionController.deleteCollection,
);

router.get('/:collectionId', validate(getCollectionSchema), collectionController.getCollection);

export default router;
