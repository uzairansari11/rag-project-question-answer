// src/utils/podcast.utils.js

const HOST_VOICE = 'alloy';
const EXPERT_VOICE = 'nova';

export function podcastToSegments(podcast) {
  const participants = Object.fromEntries(
    podcast.participants.map((participant) => [participant.id, participant]),
  );

  const segments = [];

  // Podcast title
  segments.push({
    type: 'title',
    voice: HOST_VOICE,
    text: podcast.title,
  });

  // Description
  if (podcast.description) {
    segments.push({
      type: 'description',
      voice: HOST_VOICE,
      text: podcast.description,
    });
  }

  for (const chapter of podcast.chapters) {
    // Chapter title
    segments.push({
      type: 'chapter',
      voice: HOST_VOICE,
      text: `Chapter ${chapter.title}`,
    });

    // Chapter summary
    if (chapter.summary) {
      segments.push({
        type: 'summary',
        voice: HOST_VOICE,
        text: chapter.summary,
      });
    }

    // Conversation
    for (const segment of chapter.segments) {
      const participant = participants[segment.speaker];

      segments.push({
        type: 'dialogue',
        speaker: participant.name,
        role: participant.role,
        voice: participant.role === 'host' ? HOST_VOICE : EXPERT_VOICE,
        text: segment.text,
      });
    }
  }

  return segments;
}
