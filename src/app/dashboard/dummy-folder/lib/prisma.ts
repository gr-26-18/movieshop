import { PrismaClient } from "@/generated/prisma-dashboard/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const DASHBOARD_DATABASE_URL =
  process.env.DUMMY_DATABASE_URL ?? "file:./src/app/dashboard/dummy-folder/dashboard-dev.db";

const globalForDashboardPrisma = globalThis as unknown as {
  prismaDashboard: PrismaClient | undefined;
};

export const prismaDashboard =
  globalForDashboardPrisma.prismaDashboard ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: DASHBOARD_DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDashboardPrisma.prismaDashboard = prismaDashboard;
}
