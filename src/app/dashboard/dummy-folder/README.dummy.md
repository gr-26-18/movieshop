# Isolated Commands for Dashboard Task

Since we are avoiding changes to the root `package.json`, use these commands directly from the project root:

## Prisma Commands
- **Generate Client**:
  `npx prisma generate --schema src/app/dashboard/dummy-folder/schema.dummy.prisma`
- **Push Schema**:
  `npx prisma db push --schema src/app/dashboard/dummy-folder/schema.dummy.prisma --url "file:./src/app/dashboard/dummy-folder/dashboard-dev.db"`
- **Open Studio**:
  `npx prisma studio --schema src/app/dashboard/dummy-folder/schema.dummy.prisma --url "file:./src/app/dashboard/dummy-folder/dashboard-dev.db"`
- **Seed Database**:
  `npx tsx src/app/dashboard/dummy-folder/seed.dummy.ts`

## Styling
Your CSS is isolated in `globals.css` and imported in `src/app/dashboard/layout.tsx`. It will not affect the rest of the team's application.
