import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Clear existing users
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: 'demo@taskforge.dev',
      password: 'hashedpassword',
      name: 'Demo User',
      projects: {
        create: [
          {
            name: 'Website Redesign',
            description: 'Rebuild the company site with React and Chakra',
            tasks: {
              create: Array.from({ length: 5 }).map(() => ({
                title: faker.hacker.phrase() as string,
                description: faker.lorem.sentence() as string,
                status: 'TODO',
                priority: 'MEDIUM',
              })),
            },
          },
        ],
      },
    },
    include: { projects: { include: { tasks: true } } },
  });

  console.log('✅ Seeded user:', user.email);
}

// 🧠 Wrap in a safe catch/finally — no implicit “error typed value”
main()
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('❌ Seed error:', err.message);
    } else {
      console.error('❌ Unknown seed error:', err);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
