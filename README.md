# Movieshope Project

Welcome to the team! Follow these steps to get your local environment running and to contribute features correctly.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup environment:**Copy `.env.example` to a new file named `.env` and fill in your database credentials.
   ```bash
   cp .env.example .env
   ```
3. **Sync Database:**Run this to sync your schema with your local database:
   ```bash
   npx prisma db push
   ```
4. **Run the app:**
   ```bash
   npm run dev
   ```

---

## Contribution Workflow (Git)

To keep the project stable, **never push directly to `main`**. Use the following flow:

1. **Sync with the team:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create your feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Work and Commit:**
   ```bash
   git add .
   git commit -m "feat: add movie card styling"
   ```
4. **Push and Open a PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

   *After pushing, go to GitHub and open a **Pull Request (PR)**.*

---

## Important: Prisma & Database Changes

If you change the `prisma/schema.prisma` file:

* **You must** commit the changes to that file.
* **Others:** If you pull changes that include a schema update, you **must** run:
  ```bash
  npx prisma generate
  ```
  This ensures your text editor (VS Code) understands the new database structure.
