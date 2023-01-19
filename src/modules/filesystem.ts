import { promises as fsPromises } from 'fs';
import { logger } from './logger';

async function getFileFromDir(dirPath: string): Promise<string[]> {
  const fileList = await fsPromises.readdir(dirPath);

  if (fileList) {
    logger.info('Files Found. Returning.');
    return fileList;
  } else {
    logger.info(`No Files Found In ${dirPath}.`);
    return [];
  }
}

async function checkIfFileExists(filePath: string): Promise<boolean> {
  try {
    // TODO: Here is where we need to check extension
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readImageFile(imageFilename: string): Promise<Buffer> {
  const imgBuffer = await fsPromises.readFile(imageFilename);

  if (imgBuffer) return imgBuffer;
  else return {} as Buffer;
}

export { getFileFromDir, checkIfFileExists, readImageFile };
