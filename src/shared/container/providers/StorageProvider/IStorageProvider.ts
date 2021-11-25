export type FolderType = 'avatar' | 'car';

export interface IStorageProvider {
  save(file: string, folder: FolderType): Promise<string>;
  delete(file: string, folder: FolderType): Promise<void>;
}
