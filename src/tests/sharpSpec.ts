import sharp from 'sharp';
import { FULL_PATH_PREFIX } from '../modules/constants';
import { readImageFile } from '../modules/filesystem';

async function readImg(fname: string): Promise<Buffer> {
  const imgBuffer = await readImageFile(`${FULL_PATH_PREFIX}${fname}`);
  if (imgBuffer) {
    return imgBuffer;
  } else {
    return {} as Buffer;
  }
}

describe('Test Image Conversions', () => {
  // Should resize image to set dimensions
  it('Should resize image', async () => {
    const imgBuffer = await readImg('fjord.jpg');
    await sharp(imgBuffer)
      .resize(800, 600)
      .toBuffer(function (err, data, info) {
        if (err) throw err;
        expect(data.length > 0);
        expect(info.format).toBe('jpg');
        expect(info.width).toBe(800);
        expect(info.height).toBe(600);
      });
  });

  // Should resize image to set extension
  it('Should convert image to set extension', async () => {
    const imgBuffer = await readImg('fjord.jpg');
    await sharp(imgBuffer)
      .resize(256, 256)
      .png()
      .toBuffer(function (err, data, info) {
        if (err) throw err;
        expect(data.length > 0);
        expect(info.format).toBe('png');
        expect(info.width).toBe(256);
        expect(info.height).toBe(256);
      });
  });
});
