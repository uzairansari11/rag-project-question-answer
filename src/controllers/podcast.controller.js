import podcastService from '../services/podcast.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

export const generatePodcast = asyncHandler(async (req, res) => {
  const podcast = await podcastService.generate(req.params.documentId);

  return successResponse({
    res,
    status: 201,
    message: 'Podcast generated successfully',
    data: podcast,
  });
});

export const getPodcasts = asyncHandler(async (req, res) => {
  const podcasts = await podcastService.getAll();

  return successResponse({
    res,
    data: podcasts,
    message: 'Podcast fetch successfully.',
    status: 200,
  });
});

export const getPodcast = asyncHandler(async (req, res) => {
  const podcasts = await podcastService.getPodcast(req.params.podcastId, req.user.id);

  return successResponse({
    res,
    data: podcasts,
    message: 'Podcast fetch successfully.',
    status: 200,
  });
});
