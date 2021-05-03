import fs from 'fs';

export const deleteFile = async (fileName: string) => {
  try {
    await fs.promises.stat(fileName);
  } catch {
    // eslint-disable-next-line no-useless-return
    return;
  }

  await fs.promises.unlink(fileName);
};
