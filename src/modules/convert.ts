import sharp from 'sharp';
import { ImageRequest } from '../types/ImageRequest';
import { logger } from './logger';
import { checkIfFileExists, readImageFile } from './filesystem';
import { FULL_PATH_PREFIX, THUMB_PATH_PREFIX } from './constants';

async function convert(imageRequest: ImageRequest): Promise<string> {
  const filePath = `${FULL_PATH_PREFIX}${imageRequest.fullFilename}`;
  if (await checkIfFileExists(filePath)) {
    const imgBuffer = await readImageFile(filePath);

    if (imgBuffer) {
      const convertedImageFilePath = `${THUMB_PATH_PREFIX}${imageRequest.fname}-${imageRequest.width}-${imageRequest.height}.${imageRequest.extension}`;

      if (await checkIfFileExists(convertedImageFilePath)) {
        logger.info('Serving Cached Image');
        return convertedImageFilePath;
      } else {
        logger.info('Converting Image');
        await sharp(imgBuffer)
          .resize(imageRequest.width, imageRequest.height)
          .toFile(convertedImageFilePath);
      }
      return convertedImageFilePath;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export { convert };
