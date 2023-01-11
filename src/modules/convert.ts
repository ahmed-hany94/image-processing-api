import sharp from 'sharp';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { ImageRequest } from '../types/ImageRequest';
import { logger } from './logger';

const FULL_PATH_PREFIX = './../../assets/full/';
const THUMB_PATH_PREFIX = './../../assets/thumb/';

async function checkIfFileExists(filePath: string): Promise<boolean> {
  try {
    await fsPromises.access(path.resolve(__dirname + filePath));
    return true;
  } catch {
    return false;
  }
}

async function convert(imageRequest: ImageRequest): Promise<string> {
  const filePath = `${FULL_PATH_PREFIX}${imageRequest.fullFilename}`;
  if (await checkIfFileExists(filePath)) {
    const imgBuffer = await fsPromises.readFile(
      path.resolve(__dirname + filePath)
    );

    const convertedImageFilePath = `${THUMB_PATH_PREFIX}${imageRequest.fname}-${imageRequest.width}-${imageRequest.height}.${imageRequest.extension}`;
    if (await checkIfFileExists(convertedImageFilePath)) {
      logger.info('Serving Cached Image');
      return path.resolve(__dirname + convertedImageFilePath);
    } else {
      logger.info('Converting Image');
      await sharp(imgBuffer)
        .resize(imageRequest.width, imageRequest.height)
        .toFile(path.resolve(__dirname + convertedImageFilePath));

      return path.resolve(__dirname + convertedImageFilePath);
    }
  } else {
    return '';
  }
}

export { convert };
