import { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime';
import { resolve } from 'path';

import upload from '@config/upload';

import { FolderType, IStorageProvider } from '../IStorageProvider';

export class S3StorageProvider implements IStorageProvider {
  private cliente: S3;

  constructor() {
    this.cliente = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  public async save(file: string, folder: FolderType): Promise<string> {
    const originalName = resolve(upload.tempFolder, file);
    const fileContent = await fs.promises.readFile(originalName);

    const ContentType = mime.getType(originalName);

    await this.cliente
      .putObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      })
      .promise();
    await fs.promises.unlink(originalName);
    return file;
  }
  public async delete(file: string, folder: FolderType): Promise<void> {
    await this.cliente
      .deleteObject({
        Bucket: `${process.env.AWS_BUCKET}/${folder}`,
        Key: file,
      })
      .promise();
  }
}
