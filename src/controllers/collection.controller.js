// collection.controller.js

import collectionService from '../services/collection.service.js';
import { asyncHandler } from '../utils/async.handler.js';

export const getCollections = asyncHandler(async (req, res) => {
  const collections = await collectionService.getCollections(req.user.id);

  res.status(200).json({
    success: true,
    data: collections,
  });
});

export const createCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.createCollection(req.user.id, req.body);

  res.status(201).json({
    success: true,
    message: 'Collection created successfully',
    data: collection,
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.updateCollection(
    req.user.id,
    req.params.collectionId,
    req.body,
  );

  res.status(200).json({
    success: true,
    message: 'Collection updated successfully',
    data: collection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  await collectionService.deleteCollection(req.user.id, req.params.collectionId);

  res.status(200).json({
    success: true,
    message: 'Collection deleted successfully',
  });
});
