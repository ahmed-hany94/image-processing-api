type ImageRequest = {
  fname: string;
  extension: string;
  fullFilename: string;
  originalFilename: string;
  width: number;
  height: number;
  isValidRequest: boolean;
  isEmptyRequest: boolean;
  isFilenameParamNull: boolean;
  isWidthParamNull: boolean;
  isHeightParamNull: boolean;
};

function createImageRequest(
  f: string,
  w: string,
  h: string,
  e: string
): ImageRequest {
  const filename = f as string;
  const width = parseInt(w as string);
  const height = parseInt(h as string);
  const ext = e as string;

  let fname = '';
  let extension = '';
  let _originalFilename = '';

  if (filename) {
    // If there is no extension param
    //   extract name and convert to the same extension
    // Else extract the name and convert to the extension param type
    if (filename.split('.').length === 2) {
      fname = filename.split('.')[0];
      _originalFilename = filename;
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
    originalFilename: _originalFilename,
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
