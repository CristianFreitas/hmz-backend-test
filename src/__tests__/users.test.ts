import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import './setup';

const prisma = new PrismaClient();
let authToken: string;
let userId: number;

beforeAll(async () => {
  // Buscar o ID do usuário de teste
  const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' }
  });
  
  if (user) {
    userId = user.id;
    // Gerar token JWT para testes
    authToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  }
});

describe('Users API', () => {
  it('should get list of users with pagination', async () => {
    const response = await request(app)
      .get('/api/users?page=1&per_page=5')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('per_page');
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('total_pages');
  });

  it('should get a user by ID', async () => {
    const response = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id', userId);
    expect(response.body.data).toHaveProperty('email', 'test@example.com');
  });

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .get('/api/users/9999')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
  });

  it('should update a user', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        firstName: 'Updated',
        lastName: 'Name'
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('firstName', 'Updated');
    expect(response.body.data).toHaveProperty('lastName', 'Name');
  });

  it('should require authentication for protected routes', async () => {
    const response = await request(app)
      .get('/api/users');

    expect(response.status).toBe(401);
  });

  it('should reject invalid token', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });
});