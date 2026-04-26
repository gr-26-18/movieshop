import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaShutdownHandlersRegistered: boolean | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: DATABASE_URL }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

if (
  process.env.NODE_ENV !== "production" &&
  !globalForPrisma.prismaShutdownHandlersRegistered
) {
  globalForPrisma.prismaShutdownHandlersRegistered = true;

  process.on("exit", () => {
    void prisma.$disconnect();
  });

  process.on("SIGINT", () => {
    void prisma.$disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    void prisma.$disconnect();
    process.exit(0);
  });
}
