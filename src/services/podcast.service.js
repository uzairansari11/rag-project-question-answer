import { PodcastStatus } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { documentService } from './document.service.js';
import llmService from './llm.service.js';
import s3Service from './s3.service.js';
import ttsService from './tts.service.js';

class PodcastService {
  async #create(data) {
    return prisma.podcast.create({
      data,
    });
  }

  async #update(id, data) {
    return prisma.podcast.update({
      where: {
        id,
      },
      data,
    });
  }

  async generate(documentId) {
    const { textKey } = await documentService.getDocumentById({ params: { documentId } });

    // Create podcast record
    const podcast = await this.#create({
      documentId,
      status: PodcastStatus.PROCESSING,
    });

    try {
      // Read extracted document text
      const documentText = await s3Service.getText(textKey);

      // Generate podcast script
      const podcastScript = await llmService.generatePodcast({
        document: documentText,
      });

      // Upload script to S3
      const { key: scriptKey } = await s3Service.uploadPodcastScript({
        documentId,
        podcastId: podcast.id,
        podcast: podcastScript,
      });

      const podcastText = podcastScript.chapters
        .flatMap((chapter) => chapter.segments)
        .map((segment) => segment.text)
        .join('\n\n');

      const audioBuffer = await ttsService.generate({
        text: podcastText,
      });

      const { key: audioKey } = await s3Service.uploadPodcastAudio({
        documentId,
        podcastId: podcast.id,
        buffer: audioBuffer,
      });

      // Mark podcast as complete
      return await this.#update(podcast.id, {
        title: podcastScript.title,
        description: podcastScript.description,
        language: podcastScript.language,
        durationSeconds: podcastScript.estimatedDurationSeconds,
        scriptKey,
        audioKey,
        status: PodcastStatus.COMPLETED,
      });
    } catch (error) {
      try {
        await this.#update(podcast.id, {
          status: PodcastStatus.FAILED,
        });
      } catch {
        // Ignore update failure and preserve the original error.
      }

      throw error;
    }
  }

  async getAll() {
    const podcasts = await prisma.podcast.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        document: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return podcasts;
  }

  async getPodcast(podcastId, userId) {
    const podcast = await prisma.podcast.findFirst({
      where: {
        id: podcastId,
        document: {
          user: {
            id: userId,
          },
        },
      },
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
}

export default new PodcastService();
