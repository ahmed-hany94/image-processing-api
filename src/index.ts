import express, { Express, Request, Response } from 'express';
import { convert } from './modules/convert';
import { PORT, ASSETS_DIR, Error_Reason } from './modules/constants';
import { sendErrorPage, sendIndexPage } from './modules/page';
import { createImageRequest, ImageRequest } from './types/ImageRequest';
import { logger } from './modules/logger';

const app: Express = express();
app.use(express.static(ASSETS_DIR));

app.get('/', (_, res: Response) => {
  res.redirect('/api/images');
});

app.get(
  '/api/images',
  async function (req: Request, res: Response): Promise<void> {
    try {
      const imageRequest: ImageRequest = createImageRequest(req);
      if (imageRequest.isValidRequest) {
        logger.info('Valid Request');
        // TODO: support other image formats
        // TODO: Allow for multiple sizes for the same image
        // TODO: explore sharp
        // TODO: add logging
        // TODO: create front-end for upload, display, editing
        // TODO: put different functions in a separate module (file)
        // Reference: https://review.udacity.com/#!/rubrics/3005/view

        const convertedImageFilePath = await convert(imageRequest);

        if (convertedImageFilePath !== '') {
          res.status(200).sendFile(convertedImageFilePath);
        } else {
          logger.info('File Does not exist');
          const html = sendErrorPage(Error_Reason.FILE_DOES_NOT_EXIST);
          res.status(404).send(html);
        }
      } else if (imageRequest.isEmptyRequest) {
        logger.info('Serving Index');
        const html = await sendIndexPage();
        res.status(200).send(html);
      } else {
        if (imageRequest.isFilenameParamNull) {
          logger.error('Filename Is Null');
          const html = sendErrorPage(Error_Reason.FILENAME_NOT_SPECIFIED);
          res.status(404).send(html);
        }

        if (imageRequest.isWidthParamNull || imageRequest.isHeightParamNull) {
          logger.error('Image Dimensions Are Not Specified');
          const html = sendErrorPage(
            Error_Reason.IMAGE_DIMENSIONS_NOT_SPECIFIED
          );
          res.status(404).send(html);
        }
      }
    } catch (e) {
      logger.error('Something went wrong');
      const html = sendErrorPage(
        Error_Reason.GENERIC_ERROR_WITH_HELPFUL_MESSAGE
      );
      res.status(404).send(html);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

export { app };
