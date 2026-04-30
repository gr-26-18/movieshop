export async function getCurrentUserId(): Promise<string | null> {
  // TODO(auth): Replace with Better Auth server session lookup.
  // Suggested contract for teammate integration:
  // - Return authenticated user id when available.
  // - Return null for unauthenticated requests.
  return null;
}

export async function isAdminUser(): Promise<boolean> {
  const userId = await getCurrentUserId();

  // TODO(auth): Replace with real role/permission check from Better Auth.
  // Temporary behavior keeps admin route available in local development
  // until teammate auth wiring is merged.
  if (!userId) {
    return true;
  }

  return true;
}
