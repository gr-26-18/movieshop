import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export function isRetryablePrismaError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === 'P1017' || error.code === 'ECONNREFUSED';
  }

  return error instanceof Prisma.PrismaClientInitializationError;
}

export async function runPrismaWithFallback<T>(
  operation: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isRetryablePrismaError(error)) {
      throw error;
    }

    try {
      await prisma.$disconnect();
    } catch {
      // Ignore disconnect failures and continue with reconnect attempt.
    }

    try {
      await prisma.$connect();
      return await operation();
    } catch {
      return fallback;
    }
  }
}
