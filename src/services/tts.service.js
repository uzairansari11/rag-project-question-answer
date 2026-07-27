import openai from '../config/openai.js';

class TTSService {
  model = 'gpt-4o-mini-tts';
  async generate({ text, voice = 'alloy', instructions }) {
    const response = await openai.audio.speech.create({
      model: this.model,
      voice,
      input: text,
      ...(instructions && { instructions }),
    });

    return Buffer.from(await response.arrayBuffer());
  }
}

export default new TTSService();
