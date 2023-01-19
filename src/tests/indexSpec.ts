import supertest from 'supertest';
import { app } from '../index';
import { ERROR_MESSAGES } from '../modules/constants';

const request = supertest(app);

describe('Test endpoint responses', () => {
  // localhost:3000/api/images
  it('Should get the api endpoint', async () => {
    await request.get('/api/images').expect(200);
  });

  // localhost:3000/api/images?filename=fjord&width=200&height=200
  it('Should query contains an existing filename with correct extension, width and height', async () => {
    await request
      .get('/api/images?filename=fjord.jpg&width=200&height=200')
      .expect(200)
      .expect('Content-Type', /image/);
  });

  // localhost:3000/api/images?filenames=fjordd&width=200&height=200
  it("Shouldn't succeed as filename does not exist", async () => {
    await request
      .get('/api/images?filename=fjordd&width=200&height=200')
      .expect(404)
      .expect(function (res) {
        res.text.includes(ERROR_MESSAGES.FILE_DOES_NOT_EXIST);
      });
  });

  // localhost:3000/api/images?filename=&width=200&height=200
  it("Shouldn't succeed as param filename is malformed", async () => {
    await request
      .get('/api/images?filename=&width=200&height=200')
      .expect(404)
      .expect(function (res) {
        res.text.includes(ERROR_MESSAGES.FILENAME_NOT_SPECIFIED);
      });
  });

  // localhost:3000/api/images?filenames=name&widthhh=200&height=200
  it("Shouldn't succeed as param width is malformed", async () => {
    await request
      .get('/api/images?filename=name&widthhh=200&height=200')
      .expect(404)
      .expect(function (res) {
        res.text.includes(ERROR_MESSAGES.IMAGE_DIMENSIONS_NOT_SPECIFIED);
      });
  });

  // localhost:3000/api/images?filenames=name&widthhh=200&heighttt=200
  it("Shouldn't succeed as param height is malformed", async () => {
    await request
      .get('/api/images?filename=name&width=200&heighttt=200')
      .expect(404)
      .expect(function (res) {
        res.text.includes(ERROR_MESSAGES.IMAGE_DIMENSIONS_NOT_SPECIFIED);
      });
  });
});
