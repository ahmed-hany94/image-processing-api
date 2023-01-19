import express, { Express, Request, Response, Router } from 'express';
import cors from 'cors';
import multer from 'multer';
import { convert } from './modules/convert';
import {
  PORT,
  Error_Reason,
  PUBLIC_DIR,
  FULL_PATH_PREFIX
} from './modules/constants';
import { sendErrorPage, sendIndexPage } from './modules/page';
import { createImageRequest, ImageRequest } from './types/ImageRequest';
import { logger } from './modules/logger';
import { checkIfFileExists } from './modules/filesystem';

const app: Express = express();
const router: Router = express.Router();
app.use(cors());
app.use('/public', express.static(PUBLIC_DIR));

const storage = multer.diskStorage({
  destination: FULL_PATH_PREFIX
});

const upload = multer({ storage: storage });

router.route('/').get(function (req: Request, res: Response) {
  res.redirect('/public/index.html');
});

router
  .route('/api/images')
  .get(async function (req: Request, res: Response): Promise<void> {
    try {
      const imageRequest: ImageRequest = createImageRequest(
        req.query.filename as string,
        req.query.width as string,
        req.query.height as string,
        req.query.ext as string
      );
      if (imageRequest.isValidRequest) {
        logger.info('Valid Request');
        // TODO: support other image formats
        // TODO: explore sharp
        // TODO: create front-end for
        //       upload, display, editing
        // TODO: put different functions in
        //       a separate module (file)
        // TODO: Write the README,
        //       mention logging but it's .gitignored
        // TODO: Fix the extension setting if it's set
        //       in the filename param too
        // Search in all the files for todos or comments
        // Comment the code if needed
        // TODO: Responsive UI
        // Reference: https://review.udacity.com/#!/rubrics/3005/view

        const convertedImageFilePath = await convert(imageRequest);

        if (convertedImageFilePath !== '') {
          logger.info('Converting Image Successfully');
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
  });

router
  .route('/api/upload')
  .post(upload.single('img'), async function (req: Request, res: Response) {
    if (
      await checkIfFileExists(`${FULL_PATH_PREFIX}${req.file?.originalname}`)
    ) {
      const imageRequest: ImageRequest = createImageRequest(
        req.file?.originalname as string,
        req.body.width,
        req.body.height,
        req.body.ext
      );

      const convertedImageFilePath = await convert(imageRequest);

      if (convertedImageFilePath !== '') {
        logger.info('Converting Image Successfully');
        res.status(200).json({ path: convertedImageFilePath });
      } else {
        logger.info('Frontend Conversion Failed.');
        res.status(404).json({ msg: 'Error' });
      }
    } else {
      res.status(404).end();
    }
  });

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

export { app };
