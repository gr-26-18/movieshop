Current Project: what exists now

- Stack: Next.js App Router + Prisma + Postgres.
- Current routes: home (/) and dashboard /dashboard.
- Data model already includes Movie, Genre, Person, MovieCredit, Order, OrderItem.
- No dedicated admin route exists yet (for example /admin/movies).
- Auth package (better-auth) is installed, but dashboard still uses placeholder user id.

Goal (final result)

Build an admin workflow where authorized users can:

1. View all movies in a searchable table/list.
2. Create a new movie.
3. Edit existing movie data.
4. Adjust inventory/stock.
5. Delete/archive movies safely.
6. Manage movie relations (genres, cast/director credits) at least at a basic level.

Implementation Plan
Phase 1 - Admin foundation

1.1 Create admin route skeleton

- Add route group/pages:
  - src/app/admin/layout.tsx
  - src/app/admin/page.tsx (redirect or overview)
  - src/app/admin/movies/page.tsx
- Reuse existing UI primitives for consistent look.

1.2 Add authorization boundary

- Add a server helper for current user + role check.
- Block non-admin users at route/layout level.
- Decide behavior for unauthorized access (redirect vs 403 page).

Deliverable: admin pages are reachable only by allowed users.

Phase 2 - Read/list movies

2.1 Server-side query for movie list

- Add fetch logic with pagination:
  - order by updatedAt desc
  - optional search by title
  - optional filter by stock/status
- Include useful related data count (genres, credits).

2.2 Admin movie list UI

- Table/cards with columns:
  - title
  - price
  - stock
  - release date
  - updated at
  - actions (edit/delete)
- Empty state and loading state.

Deliverable: /admin/movies shows a stable list with filters/search.

Phase 3 - Create movie

3.1 Add create form

- Fields:
  - title (required)
  - description (required)
  - price (required)
  - releaseDate (required)
  - imageUrl (optional)
  - stock (required)
  - runtime (optional)
- Add form validation (server-first, optional client hints with Zod).

3.2 Persist new movie

- Add server action or route handler to create movie.
- Handle validation errors and success feedback.

Deliverable: admin can create movie records from UI.

Phase 4 - Edit movie

4.1 Edit page/form

- Route example: src/app/admin/movies/[id]/edit/page.tsx
- Pre-fill form with existing data.
- Use same validation rules as create.

4.2 Save updates

- Update only allowed fields.
- Handle not-found and stale-id cases cleanly.

Deliverable: movie updates work end-to-end.
Phase 5 - Delete/archive and stock management

5.1 Safe remove strategy

- Prefer soft delete/archive if storefront will be added soon.
- If hard delete is required, guard against accidental removal:
  - confirmation dialog
  - relation checks

5.2 Fast stock updates

- Add quick stock adjustment control in list or edit screen.
- Validate non-negative values and integer constraints.

Deliverable: admin can safely maintain inventory.

Phase 6 - Relations management (genres + credits)

6.1 Genre assignment

- UI to attach/detach existing genres for a movie.
- Optional: create new genre inline.

6.2 Credits assignment

- Add director/actor links via `MovieCredit` with `CreditRole`.
- Prevent duplicate `(movieId, personId, role)` entries (already unique in schema).

Deliverable: movie metadata is production-usable, not just title/price.



Day-by-day execution plan

Day 1 - Data and setup

- schema/seed consistency
- Confirm money format and status enums across schema + seed.
- Regenerate Prisma client and run local sanity checks.

Day 2 - Admin skeleton

- Create admin layout/pages (/admin, /admin/movies).
- Add minimal auth/role gate so only allowed users can access admin.
- Open PR for skeleton + access control baseline.

Day 3 - Movie listing

- Implement server-side movie query with pagination.
- Add search/filter support and stable UI list/table.
- Add empty/loading states and open PR.

Day 4 - Create and edit flows

- Build create movie form with validation.
- Build edit movie page with prefilled data.
- Persist updates and handle not-found/error cases.
- Open PR for create/edit.

Day 5 - Inventory and cleanup

- Add stock adjustment and safe delete/archive flow.
- Add basic genre/credits assignment if time allows.
- Run final checklist and write handoff notes.