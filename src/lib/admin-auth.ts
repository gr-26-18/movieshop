import { getSession } from "@/lib/session";

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}

export async function isAdminUser(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;
  return session.user.role === "admin";
}