import { promises as fsPromises } from 'fs';
import { ERROR_MESSAGES, Error_Reason, FULL_PATH_PREFIX } from './constants';

async function sendIndexPage(): Promise<string> {
  let html = `
        <h1>Hello, world from my server</h1>
        <p>Files avaiable to be converted in the 'full' directory</p>
        <ul>
      `;

  await (
    await fsPromises.readdir(FULL_PATH_PREFIX)
  ).forEach((file) => (html += `<li>${file}</li>`));
  html += '</ul>';
  return html;
}

function sendErrorPage(errorReason: Error_Reason | undefined): string {
  let html = ERROR_MESSAGES.ERROR_HEADER;
  switch (errorReason) {
    case Error_Reason.FILE_DOES_NOT_EXIST:
      html += ERROR_MESSAGES.FILE_DOES_NOT_EXIST;
      break;
    case Error_Reason.FILENAME_NOT_SPECIFIED:
      html += ERROR_MESSAGES.FILENAME_NOT_SPECIFIED;
      break;
    case Error_Reason.IMAGE_DIMENSIONS_NOT_SPECIFIED:
      html += ERROR_MESSAGES.IMAGE_DIMENSIONS_NOT_SPECIFIED;
      break;
    case Error_Reason.GENERIC_ERROR_WITH_HELPFUL_MESSAGE:
      html += '</h1>';
      html += ERROR_MESSAGES.GENERIC_ERROR_WITH_HELPFUL_MESSAGE;
      break;
    default:
      html += '</h1>';
      html += ERROR_MESSAGES.GENERIC_ERROR_WITH_HELPFUL_MESSAGE;
      break;
  }

  return html;
}

export { sendIndexPage, sendErrorPage };
