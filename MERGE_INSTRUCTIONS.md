# Dashboard Merge Instructions

This document outlines the exact steps required to merge the isolated dashboard feature branch (`feature/dashbord`) into the team's main repository. 

Because the dashboard was built using an isolated "dummy" database and CSS files to avoid conflicts during development, these dummy files must be removed and integrated with the global configurations before or during the merge.

## Step 1: Merge the Database Schema
The dashboard currently relies on an isolated SQLite schema located at `src/app/dashboard/dummy-folder/schema.dummy.prisma`.

1. Open the team's main schema file: `prisma/schema.prisma`
2. Copy the newly created models (`Movie`, `Order`, `OrderItem`, and `OrderStatus` enum) from `schema.dummy.prisma` and paste them into the main `schema.prisma`.
3. Once the main schema is updated, the team should run their standard push/migration command (e.g., `npx prisma db push`) to apply these tables to the PostgreSQL database.

## Step 2: Update Prisma Client Imports
The dashboard components currently fetch data using an isolated Prisma client. This needs to be updated to use the team's global Prisma client.

1. Open all dashboard pages and components (primarily `src/app/dashboard/page.tsx`).
2. Locate the isolated import:
   ```typescript
   import { prismaDashboard as prisma } from "./dummy-folder/lib/prisma";
   ```
3. Replace it with the global import:
   ```typescript
   import { prisma } from "@/lib/prisma";
   ```

## Step 3: Merge the Seed Data
The dummy database was populated using `src/app/dashboard/dummy-folder/seed.dummy.ts`.

1. Open the team's main seed file: `prisma/seed.ts`.
2. Copy the movie and order generation logic from `seed.dummy.ts` and integrate it into the main `seed.ts` file. 
3. This ensures that whenever the team seeds the database, the dashboard will have the necessary test data.

## Step 4: Merge the CSS Theme (Optional but Recommended)
The dashboard uses specific Shadcn UI styling variables located in `src/app/dashboard/dashboard.css`.

1. Open the team's main CSS file: `src/app/globals.css`.
2. Copy the `@theme inline { ... }` block and the `.dark` variant variables from `dashboard.css`.
3. Paste them into `globals.css` so the entire application shares a uniform design system.
4. Remove the `import "./dashboard.css";` line from `src/app/dashboard/layout.tsx`.

## Step 5: Clean Up Dummy Files
Once the schema, imports, seed data, and CSS have been successfully integrated into the team's main files, the isolated dummy files are no longer needed.

1. Delete the entire `src/app/dashboard/dummy-folder` directory.
2. Delete `src/app/dashboard/dashboard.css` (if you merged the CSS).
3. Ensure no remaining files are importing anything from the `dummy-folder`.

## Note on Tailwind v4
During the development of this branch, critical fixes were applied to the global configuration to prevent Next.js from crashing when compiling Tailwind v4 (specifically, resolving the `fs` module error). 
**The following fixes must be kept in the merge:**
- `postcss.config.mjs`
- `package.json` and `package-lock.json` (Tailwind dependencies were synchronized)
- The `@import "tailwindcss";` directive in `src/app/globals.css`
