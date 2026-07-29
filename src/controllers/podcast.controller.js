import { podcastService } from '../services/podcast.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

class PodcastController {
  generatePodcast = asyncHandler(async (req, res) => {
    const { user, params } = req;
    console.log('user params', user, params);

    console.log('\n\n------------------------\n\n');

    const podcast = await podcastService.generatePodcast({
      user,
      params,
    });

    return successResponse({
      res,
      status: 201,
      message: 'Podcast generated successfully.',
      data: podcast,
    });
  });

  getPodcasts = asyncHandler(async (req, res) => {
    const { user, query } = req;
    const podcasts = await podcastService.getPodcasts({
      user,
      query,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Podcasts fetched successfully.',
      data: podcasts,
    });
  });

  getPodcast = asyncHandler(async (req, res) => {
    const { user, params } = req;

    const podcast = await podcastService.getPodcast({
      user,
      params,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Podcast fetched successfully.',
      data: podcast,
    });
  });

  updatePodcast = asyncHandler(async (req, res) => {
    const { user, params, body } = req;

    const podcast = await podcastService.updatePodcast({
      user,
      params,
      payload: body,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Podcast updated successfully.',
      data: podcast,
    });
  });

  deletePodcast = asyncHandler(async (req, res) => {
    const { user, params } = req;

    await podcastService.deletePodcast({
      user,
      params,
    });

    return successResponse({
      res,
      status: 200,
      message: 'Podcast deleted successfully.',
    });
  });
}

export const podcastController = new PodcastController();
