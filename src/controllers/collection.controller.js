import { collectionService } from '../services/collection.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

class CollectionController {
  getCollections = asyncHandler(async (req, res) => {
    const collections = await collectionService.getCollections({
      user: req.user,
    });

    return successResponse({
      res,
      status: 200,
      data: collections,
    });
  });

  getCollection = asyncHandler(async (req, res) => {
    const collection = await collectionService.getCollection({
      user: req.user,
      params: req.params,
    });

    return successResponse({
      res,
      status: 200,
      data: collection,
    });
  });

  createCollection = asyncHandler(async (req, res) => {
    const collection = await collectionService.createCollection({
      user: req.user,
      payload: req.body,
    });

    return successResponse({
      res,
      status: 201,
      message: 'Collection created successfully',
      data: collection,
    });
  });

  updateCollection = asyncHandler(async (req, res) => {
    const collection = await collectionService.updateCollection({
      user: req.user,
      params: req.params,
      payload: req.body,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Collection updated successfully',
      data: collection,
    });
  });

  deleteCollection = asyncHandler(async (req, res) => {
    await collectionService.deleteCollection({
      user: req.user,
      params: req.params,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Collection deleted successfully',
    });
  });
}

export const collectionController = new CollectionController();
