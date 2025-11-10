import { PrismaClient, TaskPriority, TaskStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TaskForge demo data...');

  // --- 🔄 Clear existing data ---
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // --- 👤 Create demo user ---
  const user = await prisma.user.create({
    data: {
      email: 'demo@taskforge.dev',
      password: 'hashedpassword', // Not a real password, for dev only
      name: 'Demo User',
    },
  });

  console.log('👤 Created user:', user.email);

  // --- 📁 Create projects (active + inactive) ---
  const projects = await prisma.$transaction(
    Array.from({ length: 5 }).map((_, i) => {
      const createdAt = faker.date.recent({ days: 60 });
      const updatedAt =
        i < 3
          ? faker.date.recent({ days: 5 }) // active
          : createdAt; // older (inactive)
      return prisma.project.create({
        data: {
          name: faker.commerce.department() + ' Project',
          description: faker.commerce.productDescription(),
          ownerId: user.id,
          createdAt,
          updatedAt,
        },
      });
    }),
  );

  console.log(`📁 Created ${projects.length} projects`);

  // --- 🧩 Create tasks ---
  const tasks = await prisma.$transaction(
    projects.flatMap((project) =>
      Array.from({ length: faker.number.int({ min: 5, max: 10 }) }).map(() =>
        prisma.task.create({
          data: {
            title: faker.hacker.phrase(),
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(Object.values(TaskStatus)),
            priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
            dueDate: faker.date.soon({ days: 30 }),
            projectId: project.id,
            assigneeId: user.id,
            createdAt: faker.date.recent({ days: 30 }),
            updatedAt: faker.date.recent({ days: 10 }),
          },
        }),
      ),
    ),
  );

  console.log(`📝 Created ${tasks.length} tasks`);

  // --- 🕒 Create activity logs (recent actions only) ---
  const recentTasks = faker.helpers.arrayElements(tasks, 15);
  const activityLogs = await prisma.$transaction(
    recentTasks.map((task) =>
      prisma.activityLog.create({
        data: {
          userId: user.id,
          projectId: task.projectId,
          taskId: task.id,
          action: faker.helpers.arrayElement([
            'CREATE_TASK',
            'UPDATE_TASK',
            'DELETE_TASK',
          ]),
          message: faker.hacker.phrase(),
          oldValue: { status: 'TODO' },
          newValue: { status: task.status },
          createdAt: faker.date.recent({ days: 7 }),
        },
      }),
    ),
  );

  console.log(`📜 Created ${activityLogs.length} activity logs`);
  console.log('✅ Seeding complete!');
}

main()
  .catch((err: unknown) => {
    if (err instanceof Error) console.error('❌ Seed error:', err.message);
    else console.error('❌ Unknown seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
