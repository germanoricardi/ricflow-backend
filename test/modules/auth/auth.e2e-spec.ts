import * as request from 'supertest';
import 'dotenv/config';

describe('AuthController (e2e)', () => {
  const baseUrl = `http://localhost:${process.env.APP_PORT}`;
  let refreshToken: string;

  it('/auth/login (POST) - success', async () => {
    const response = await request(baseUrl)
      .post('/auth/login')
      .send({
        userName: 'admin',
        password: 'qaz147852',
      })
      .expect(200);

    refreshToken = response.body.refresh_token;
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('/auth/login (POST) - error when passing invalid password', async () => {
    await request(baseUrl)
      .post('/auth/login')
      .send({
        userName: 'admin',
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('/auth/refresh-token (POST) - success', async () => {
    const response = await request(baseUrl)
      .post('/auth/refresh-token')
      .send({
        refresh_token: refreshToken,
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('/auth/request-password-reset (POST) - success', async () => {
    const response = await request(baseUrl)
      .post('/auth/request-password-reset')
      .send({
        email: 'admin@test.com',
      })
      .expect(202);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain(
      'If the user exists, an email will be sent with instructions.',
    );
  });

  it('/auth/request-password-reset (POST) - error with email not found', async () => {
    const response = await request(baseUrl)
      .post('/auth/request-password-reset')
      .send({
        email: 'email@test.com',
      })
      .expect(404);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('User not found');
  });
});
