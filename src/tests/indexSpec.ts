import supertest from 'supertest';
import { app } from '../index';

const request = supertest(app);

describe('Test endpoint responses', () => {
  // localhost:3000/api
  it('gets the api endpoint', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(404);
  });

  // localhost:3000/api/images?filename=name&width=200&height=200
  it('query contains filename, width and height', async () => {
    const response = await request.get(
      '/api?filename=name&width=200&height=200'
    );
    expect(response.status).toBe(200);
  });

  // localhost:3000/api/images?filenames=name&width=200&height=200
  it('query param filename is malformed', async () => {
    const response = await request.get(
      '/api?filenames=name&width=200&height=200'
    );
    expect(response.status).toBe(404);
  });

  // localhost:3000/api/images?filenames=name&widthhh=200&height=200
  it('query param width is malformed', async () => {
    const response = await request.get(
      '/api?filename=name&widthhh=200&height=200'
    );
    expect(response.status).toBe(404);
  });

  // localhost:3000/api/images?filenames=name&widthhh=200&heighttt=200
  it('query param height is malformed', async () => {
    const response = await request.get(
      '/api?filename=name&width=200&heighttt=200'
    );
    expect(response.status).toBe(404);
  });
});
