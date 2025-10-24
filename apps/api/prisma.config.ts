import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: {
    path: path.join('db', 'migrations'),
    seed: 'ts-node ./prisma/seed.ts',
  },
  views: {
    path: path.join('db', 'views'),
  },
  typedSql: {
    path: path.join('db', 'queries'),
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
