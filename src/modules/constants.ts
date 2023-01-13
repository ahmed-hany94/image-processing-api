import path from 'path';

// Constants
const PORT = process.env.PORT || 3000;

const ERROR_MESSAGES = {
  ERROR_HEADER: '<h1>There was an error processing this file.',
  FILE_DOES_NOT_EXIST: ' File may not exist.</h1>',
  FILENAME_NOT_SPECIFIED: ' Must specify filename.</h1>',
  IMAGE_DIMENSIONS_NOT_SPECIFIED: ' Must specify width & height.</h1>',
  GENERIC_ERROR_WITH_HELPFUL_MESSAGE:
    '<p>/api/images?filename=name[.extension]&width=width-value&height=height-value</p>'
};

// PATHS
const ROOT_DIR = path.resolve(__dirname + './../..');
const PUBLIC_DIR = path.resolve(`${ROOT_DIR}/public`);
const LOG_DIR = path.resolve(`${ROOT_DIR}/logs`);
const FULL_PATH_PREFIX = `${ROOT_DIR}/public/assets/full/`;
const THUMB_PATH_PREFIX = `${ROOT_DIR}/public/assets/thumb/`;

// ENUMS
enum Error_Reason {
  FILE_DOES_NOT_EXIST,
  FILENAME_NOT_SPECIFIED,
  IMAGE_DIMENSIONS_NOT_SPECIFIED,
  GENERIC_ERROR_WITH_HELPFUL_MESSAGE
}

export {
  PORT,
  ERROR_MESSAGES,
  ROOT_DIR,
  PUBLIC_DIR,
  LOG_DIR,
  FULL_PATH_PREFIX,
  THUMB_PATH_PREFIX,
  Error_Reason
};
