import request from 'supertest';
import app from '../app';
import './setup';

describe('Authentication API', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not login with invalid email', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'wrong@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(401);
  });

  it('should not login with invalid password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });

  it('should validate email format', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'invalid-email',
        password: 'password123'
      });

    expect(response.status).toBe(400);
  });
});