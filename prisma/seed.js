// Este arquivo é usado apenas para o Docker
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');

    // Limpar o banco de dados antes de inserir novos dados
    try {
      await prisma.user.deleteMany();
      console.log('Deleted existing users');
    } catch (error) {
      console.log('No users to delete or table does not exist yet');
    }

    // Dados de teste baseados na API ReqRes
    const users = [
      {
        email: 'george.bluth@reqres.in',
        password: 'password123',
        firstName: 'George',
        lastName: 'Bluth',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
      },
      {
        email: 'janet.weaver@reqres.in',
        password: 'password123',
        firstName: 'Janet',
        lastName: 'Weaver',
        avatar: 'https://reqres.in/img/faces/2-image.jpg',
      },
      {
        email: 'emma.wong@reqres.in',
        password: 'password123',
        firstName: 'Emma',
        lastName: 'Wong',
        avatar: 'https://reqres.in/img/faces/3-image.jpg',
      },
      {
        email: 'eve.holt@reqres.in',
        password: 'password123',
        firstName: 'Eve',
        lastName: 'Holt',
        avatar: 'https://reqres.in/img/faces/4-image.jpg',
      },
      {
        email: 'charles.morris@reqres.in',
        password: 'password123',
        firstName: 'Charles',
        lastName: 'Morris',
        avatar: 'https://reqres.in/img/faces/5-image.jpg',
      },
      {
        email: 'tracey.ramos@reqres.in',
        password: 'password123',
        firstName: 'Tracey',
        lastName: 'Ramos',
        avatar: 'https://reqres.in/img/faces/6-image.jpg',
      },
    ];

    // Criar usuários no banco de dados
    for (const user of users) {
      try {
        // Hash da senha
        const hashedPassword = await bcrypt.hash(user.password, 10); // Reduzindo a força do hash para evitar problemas

        await prisma.user.create({
          data: {
            ...user,
            password: hashedPassword,
          },
        });
        console.log(`Created user: ${user.email}`);
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error);
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();