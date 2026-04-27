## Dashboard Integration Notes

- Dashboard is aligned to main Prisma/Postgres schema (no dummy DB dependencies).
- Current user filtering uses a temporary placeholder user id in `page.tsx`.
- TODO(auth): replace placeholder with Better Auth session user id when auth integration is merged.

Suggested handoff contract:

- Provide a server-side helper that returns current user id, e.g. `getCurrentUserId(): Promise<string | null>`.
- Update dashboard query to use that helper result and handle unauthenticated state.
