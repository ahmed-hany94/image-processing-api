import { Request } from 'express';

type ImageRequest = {
  fname: string;
  extension: string;
  fullFilename: string;
  width: number;
  height: number;
  isValidRequest: boolean;
  isEmptyRequest: boolean;
  isFilenameParamNull: boolean;
  isWidthParamNull: boolean;
  isHeightParamNull: boolean;
};

function createImageRequest(req: Request): ImageRequest {
  const filename = req.query.filename as string;
  const width = parseInt(req.query.width as string);
  const height = parseInt(req.query.height as string);
  const ext = req.query.extension as string;

  let fname = '';
  let extension = '';

  if (filename) {
    if (filename.split('.').length === 2) {
      fname = filename.split('.')[0];
      extension = !ext ? filename.split('.')[1] : ext;
    } else {
      fname = filename;
      extension = ext || 'jpg';
    }
  }

  return {
    fname: fname,
    extension: extension,
    fullFilename: `${fname}.${extension}`,
    width: width,
    height: height,
    isValidRequest: filename && width && height ? true : false,
    isEmptyRequest:
      filename === undefined && Number.isNaN(width) && Number.isNaN(height)
        ? true
        : false,
    isFilenameParamNull: !filename ? true : false,
    isWidthParamNull: !width ? true : false,
    isHeightParamNull: !height ? true : false
  };
}

export { ImageRequest, createImageRequest };
