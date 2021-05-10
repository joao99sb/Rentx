import fs from 'fs';

export const deleteFile = async (fileName: string): Promise<void> => {
  try {
    await fs.promises.stat(fileName);
  } catch (e) {
    // eslint-disable-next-line no-useless-return
    console.error(e);
    return;
  }

  await fs.promises.unlink(fileName);
};
