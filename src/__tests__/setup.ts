import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Setup global test environment
beforeAll(async () => {
  // Limpar dados existentes e recriar tabelas no banco de dados de teste
  await prisma.user.deleteMany({});

  // Criar um usuário de teste
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: await bcrypt.hash('password123', 10),
      avatar: 'https://example.com/avatar.jpg'
    }
  });
});

// Cleanup after all tests
afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});