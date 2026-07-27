import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'node:path';
import s3Client from '../config/aws.config.js';

class S3Service {
  async uploadFile(documentId, file) {
    const extension = path.extname(file.originalname);
    const key = `documents/${documentId}/source${extension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    return {
      key,
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
    };
  }

  async uploadText(documentId, text) {
    const key = `documents/${documentId}/content.txt`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: text,
      ContentType: 'text/plain',
    });

    await s3Client.send(command);

    return {
      key,
      mimeType: 'text/plain',
      fileSize: Buffer.byteLength(text),
    };
  }

  async deleteFile(key) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  }

  async getFile(storageKey) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: storageKey,
    });
    const response = await s3Client.send(command);

    const buffer = Buffer.from(await response.Body.transformToByteArray());

    return buffer;
  }

  async getText(textKey) {
    const buffer = await this.getFile(textKey);

    return buffer.toString('utf-8');
  }

  async uploadPodcastScript({ documentId, podcastId, podcast }) {
    const key = `documents/${documentId}/podcasts/${podcastId}/script.json`;

    const body = JSON.stringify(podcast, null, 2);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: 'application/json',
    });

    await s3Client.send(command);

    return {
      key,
      mimeType: 'application/json',
      fileSize: Buffer.byteLength(body),
    };
  }

  async uploadPodcastAudio({ documentId, podcastId, buffer }) {
    const key = `documents/${documentId}/podcasts/${podcastId}/audio.mp3`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: 'audio/mpeg',
    });

    await s3Client.send(command);

    return {
      key,
      mimeType: 'audio/mpeg',
      fileSize: buffer.length,
    };
  }

  async getSignedUrl(key, expiresIn = 3600) {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    return getSignedUrl(s3Client, command, {
      expiresIn,
    });
  }
}

export default new S3Service();
