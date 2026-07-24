import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'node:crypto';
import path from 'node:path';
import s3Client from '../config/aws.config.js';

class S3Service {
  async uploadFile(file) {
    const key = `documents/${crypto.randomUUID()}${path.extname(file.originalname)}`;

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
}

export default new S3Service();
