import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export enum StorageType {
  LOCAL = 'LOCAL',
  S3 = 'S3',
}

export interface UploadResult {
  filename: string;
  path: string;
  url?: string;
  storageType: StorageType;
}

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const awsAccessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    const awsRegion = this.configService.get('AWS_REGION');

    if (awsAccessKeyId && awsSecretAccessKey && awsRegion) {
      this.s3Client = new S3Client({
        region: awsRegion,
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretAccessKey,
        },
      });
      this.bucket = this.configService.get('AWS_S3_BUCKET');
    }
  }

  async uploadLocal(file: Express.Multer.File): Promise<UploadResult> {
    const uploadDir = this.configService.get('UPLOAD_LOCATION', './public/uploads');
    const filename = `${uuidv4()}-${file.originalname}`;
    const filepath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filepath, file.buffer);

    return {
      filename,
      path: filepath,
      url: `${this.configService.get('APP_URL')}/uploads/${filename}`,
      storageType: StorageType.LOCAL,
    };
  }

  async uploadS3(file: Express.Multer.File): Promise<UploadResult> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    const filename = `${uuidv4()}-${file.originalname}`;
    const key = `uploads/${filename}`;

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      },
    });

    await upload.done();

    const region = this.configService.get('AWS_REGION');
    const url = `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;

    return {
      filename,
      path: key,
      url,
      storageType: StorageType.S3,
    };
  }

  async deleteLocal(filepath: string): Promise<void> {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  async deleteS3(key: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  async upload(file: Express.Multer.File, storageType: StorageType): Promise<UploadResult> {
    if (storageType === StorageType.S3) {
      return this.uploadS3(file);
    }
    return this.uploadLocal(file);
  }

  async delete(filepath: string, storageType: StorageType): Promise<void> {
    if (storageType === StorageType.S3) {
      return this.deleteS3(filepath);
    }
    return this.deleteLocal(filepath);
  }
}
