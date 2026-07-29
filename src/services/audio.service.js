import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { execa } from 'execa';
import ffmpeg from 'ffmpeg-static';

class AudioService {
  async merge(audioSegments) {
    if (!audioSegments.length) {
      throw new Error('No audio segments provided.');
    }

    const tempDir = path.join(os.tmpdir(), crypto.randomUUID());

    try {
      await fs.mkdir(tempDir, {
        recursive: true,
      });

      // Write each segment as an mp3
      for (let index = 0; index < audioSegments.length; index++) {
        const { audioBuffer } = audioSegments[index];

        await fs.writeFile(path.join(tempDir, `${index}.mp3`), audioBuffer);
      }

      // Create concat.txt
      const concatContent = audioSegments.map((_, index) => `file '${index}.mp3'`).join('\n');

      const concatFile = path.join(tempDir, 'concat.txt');

      await fs.writeFile(concatFile, concatContent);

      const outputFile = path.join(tempDir, 'output.mp3');

      // Merge using FFmpeg
      await execa(ffmpeg, [
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        concatFile,
        '-c:a',
        'libmp3lame',
        '-q:a',
        '2',
        outputFile,
      ]);

      return await fs.readFile(outputFile);
    } finally {
      await fs.rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  }
}

export default new AudioService();
