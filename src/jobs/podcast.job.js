import { PodcastStatus } from '@prisma/client';

import audioService from '../services/audio.service.js';
import { documentService } from '../services/document.service.js';
import llmService from '../services/llm.service.js';
import { podcastService } from '../services/podcast.service.js';
import s3Service from '../services/s3.service.js';
import ttsService from '../services/tts.service.js';
import { podcastToSegments } from '../utils/podcast.utils.js';

export const processPodcastJob = async (job) => {
  const { podcastId, documentId, userId } = job.data;

  try {
    // Mark as processing
    await podcastService.updatePodcast({
      user: { userId },
      params: { podcastId },
      payload: {
        status: PodcastStatus.PROCESSING,
      },
    });

    // Get document
    const document = await documentService.getDocumentByIdInternal({
      params: { documentId },
    });

    // Get document text
    const documentText = await s3Service.getText(document.textKey);

    // Generate structured podcast
    const podcastScript = await llmService.generatePodcast({
      document: documentText,
    });

    // Upload script
    const { key: scriptKey } = await s3Service.uploadPodcastScript({
      documentId,
      podcastId,
      podcast: podcastScript,
    });

    // Convert script into TTS segments
    const segments = podcastToSegments(podcastScript);

    // Generate audio for every segment
    const audioSegments = [];

    for (const segment of segments) {
      const audioBuffer = await ttsService.generate({
        text: segment.text,
        voice: segment.voice,
      });

      audioSegments.push({
        ...segment,
        audioBuffer,
      });
    }

    // Merge all audio
    const finalAudio = await audioService.merge(audioSegments);

    // Upload final audio
    const { key: audioKey } = await s3Service.uploadPodcastAudio({
      podcastId,
      documentId,
      audio: finalAudio,
    });
    console.log({
      isBuffer: Buffer.isBuffer(finalAudio),
      length: finalAudio?.length,
    });
    // Mark completed
    await podcastService.updatePodcast({
      user: { userId },
      params: { podcastId },
      payload: {
        status: PodcastStatus.COMPLETED,
        scriptKey,
        audioKey,
      },
    });
  } catch (error) {
    await podcastService.updatePodcast({
      user: { userId },
      params: { podcastId },
      payload: {
        status: PodcastStatus.FAILED,
      },
    });

    throw error;
  }
};
