import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // This tells Prisma: "When I say seed, run this file using tsx"
    seed: 'npx tsx ./prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
