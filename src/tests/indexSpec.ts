import supertest from 'supertest';
import { app } from '../index';

const request = supertest(app);

describe('Test endpoint responses', () => {
  // localhost:3000/api/images
  it('Should get the api endpoint', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(200);
  });

  // localhost:3000/api/images?filename=fjord&width=200&height=200
  it('Should query contains an existing filename, width and height', async () => {
    const response = await request.get(
      '/api/images?filename=fjord&width=200&height=200'
    );
    expect(response.status).toBe(200);
  });

  // localhost:3000/api/images?filename=fjord&width=200&height=200
  it('Should query contains an existing filename with correct extension, width and height', async () => {
    const response = await request.get(
      '/api/images?filename=fjord.jpg&width=200&height=200'
    );
    expect(response.status).toBe(200);
  });

  // localhost:3000/api/images?filenames=fjordd&width=200&height=200
  it("Shouldn't succeed as filename does not exist", async () => {
    const response = await request.get(
      '/api/images?filename=fjordd&width=200&height=200'
    );
    expect(response.status).toBe(404);
  });

  // localhost:3000/api/images?filenames=name&width=200&height=200
  it("Shouldn't succeed as param filename is malformed", async () => {
    const response = await request.get(
      '/api/images?filenames=name&width=200&height=200'
    );
    expect(response.status).toBe(404);
  });

  // localhost:3000/api/images?filenames=name&widthhh=200&height=200
  it("Shouldn't succeed as param width is malformed", async () => {
    const response = await request.get(
      '/api/images?filename=name&widthhh=200&height=200'
    );
    expect(response.status).toBe(404);
  });

  // localhost:3000/api/images?filenames=name&widthhh=200&heighttt=200
  it("Shouldn't succeed as param height is malformed", async () => {
    const response = await request.get(
      '/api/images?filename=name&width=200&heighttt=200'
    );
    expect(response.status).toBe(404);
  });
});
