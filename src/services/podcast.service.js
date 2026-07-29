import { PodcastStatus, UserRole } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { podcastQueue } from '../queues/podcast.queue.js';
import { ApiError } from '../utils/api-error.js';
import { documentService } from './document.service.js';
import s3Service from './s3.service.js';

class PodcastService {
  async #create(data) {
    return prisma.podcast.create({
      data,
    });
  }

  async #update(id, data) {
    return prisma.podcast.update({
      where: { id },
      data,
    });
  }

  async generatePodcast({ user, params }) {
    const document = await documentService.getDocumentById({
      params,
      user,
    });

    const podcast = await this.#create({
      documentId: document.id,
      status: PodcastStatus.PENDING,
    });

    await podcastQueue.add('generate-podcast', {
      podcastId: podcast.id,
      documentId: document.id,
      userId: user.id,
    });
    return podcast;
  }

  async getPodcasts({ user }) {
    console.log('Inside Podcast', user);
    const where =
      user.role === UserRole.ADMIN
        ? {}
        : {
            document: {
              userId: user.id,
            },
          };

    return prisma.podcast.findMany({
      // where,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPodcastById({ user, params }) {
    const where =
      user.role === UserRole.ADMIN
        ? {
            id: params.podcastId,
          }
        : {
            id: params.podcastId,
            document: {
              userId: user.id,
            },
          };

    const podcast = await prisma.podcast.findFirst({
      where,
    });

    if (!podcast) {
      throw new ApiError(404, 'Podcast not found.');
    }

    return podcast;
  }

  async getPodcast({ user, params }) {
    const podcast = await this.getPodcastById({
      user,
      params,
    });

    const { audioKey, scriptKey, ...rest } = podcast;

    const [audioUrl, scriptUrl] = await Promise.all([
      audioKey ? s3Service.getSignedUrl(audioKey) : null,
      scriptKey ? s3Service.getSignedUrl(scriptKey) : null,
    ]);

    return {
      ...rest,
      audioUrl,
      scriptUrl,
    };
  }

  async updatePodcast({ user, params, payload }) {
    const podcast = await this.getPodcastById({
      user,
      params,
    });

    return prisma.podcast.update({
      where: {
        id: podcast.id,
      },
      data: payload,
      select: {
        id: true,
        title: true,
        description: true,
        language: true,
        status: true,
        durationSeconds: true,
        updatedAt: true,
      },
    });
  }
  async deletePodcast({ user, params }) {
    const podcast = await this.getPodcastById({
      user,
      params,
    });

    await prisma.podcast.delete({
      where: {
        id: podcast.id,
      },
    });

    await Promise.allSettled([
      podcast.audioKey ? s3Service.deleteFile(podcast.audioKey) : Promise.resolve(),
      podcast.scriptKey ? s3Service.deleteFile(podcast.scriptKey) : Promise.resolve(),
    ]);
  }
}

export const podcastService = new PodcastService();
