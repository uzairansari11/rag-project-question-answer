// collection.controller.js

import collectionService from '../services/collection.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

export const getCollections = asyncHandler(async (req, res) => {
  const collections = await collectionService.getCollections(req.user.id);

  return successResponse({
    res,
    status: 200,
    data: collections,
  });
});

export const createCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.createCollection(req.user.id, req.body);

  return successResponse({
    res,
    status: 201,
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

  return successResponse({
    res,
    status: 200,
    message: 'Collection updated successfully',
    data: collection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  await collectionService.deleteCollection(req.user.id, req.params.collectionId);

  return successResponse({
    res,
    status: 200,
    message: 'Collection deleted successfully',
  });
});

export const getCollection = asyncHandler(async (req, res) => {
  const collection = await collectionService.getCollection(req.user.id, req.params.collectionId);

  return successResponse({
    res,
    status: 200,
    data: collection,
  });
});
