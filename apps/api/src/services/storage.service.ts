import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3';
import { env } from '@/config/env';
import createHttpError from 'http-errors';
import { logger } from '@/utils/logger';

export class StorageService {
  private static s3Client = new S3Client({
    region: env.S3_REGION,
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
  });

  static async init() {
    try {
      logger.info(`Checking if bucket '${env.S3_BUCKET}' exists...`);
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: env.S3_BUCKET })
      );
      logger.info(`Bucket '${env.S3_BUCKET}' exists.`);
    } catch (error: any) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        logger.info(`Bucket '${env.S3_BUCKET}' not found, creating...`);
        try {
          await this.s3Client.send(
            new CreateBucketCommand({ Bucket: env.S3_BUCKET })
          );
          logger.info(`Bucket '${env.S3_BUCKET}' created successfully.`);
        } catch (createError) {
          logger.error({ err: createError }, 'Failed to create bucket');
          throw new Error('Failed to create storage bucket');
        }
      } else {
        logger.error({ err: error }, 'Error checking bucket existence');
        throw error;
      }
    }

    await this.setPublicPolicy();
  }

  private static async setPublicPolicy() {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${env.S3_BUCKET}/*`],
          },
        ],
      };

      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: env.S3_BUCKET,
          Policy: JSON.stringify(policy),
        })
      );
      logger.info(`✅ Public Read Policy applied to '${env.S3_BUCKET}'.`);
    } catch (error) {
      logger.warn(
        { err: error },
        'Failed to set bucket policy (files might not be public)'
      );
    }
  }

  static async upload(
    file: Express.Multer.File,
    folder = 'uploads'
  ): Promise<string> {
    await this.init();

    const filename = `${folder}/${Date.now()}-${file.originalname.replace(
      /\s+/g,
      '_'
    )}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: filename,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      return `${env.S3_ENDPOINT}/${env.S3_BUCKET}/${filename}`;
    } catch (error) {
      logger.error({ err: error }, 'S3 Upload failed');
      throw createHttpError(502, 'Failed to upload file to storage provider');
    }
  }

  static async delete(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    try {
      const urlParts = fileUrl.split(`${env.S3_BUCKET}/`);
      if (urlParts.length < 2) return;

      const key = urlParts[1];

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: env.S3_BUCKET,
          Key: key,
        })
      );
    } catch (error) {
      logger.error({ err: error }, 'S3 Delete failed');
    }
  }
}
