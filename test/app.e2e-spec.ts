import * as request from 'supertest';
import 'dotenv/config';

describe('AppController (e2e)', () => {
  const baseUrl = `http://localhost:${process.env.APP_PORT}`;

  it('/ (GET)', () => {
    return request(baseUrl)
      .get('/')
      .expect(200)
      .expect('RicFlow CMS - The flexible CMS for any project.');
  });
});
