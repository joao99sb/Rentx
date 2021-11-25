import fs from 'fs';
import { resolve } from 'path';

import upload from '@config/upload';

import { FolderType, IStorageProvider } from '../IStorageProvider';

export class LocalStorageProvider implements IStorageProvider {
  public async save(file: string, folder: FolderType): Promise<string> {
    await fs.promises.rename(
      resolve(upload.tempFolder, file),
      resolve(`${upload.tempFolder}/${folder}`, file)
    );
    return file;
  }
  public async delete(file: string, folder: FolderType): Promise<void> {
    const fileName = resolve(`${upload.tempFolder}/${folder}`, file);

    try {
      await fs.promises.stat(fileName);
    } catch (error) {
      return;
    }
    await fs.promises.unlink(fileName);
  }
}
