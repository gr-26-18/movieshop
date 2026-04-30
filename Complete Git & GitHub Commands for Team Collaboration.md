# 🚀 Complete Git & GitHub Commands for Team Collaboration

Here's every Git command you'll need to work on your `feature/admin-dashboard` branch and collaborate with your team on the **movieshop** project.

## 📋 Prerequisites - One Time Setup

```bash
# 1. Clone the repository (if you haven't already)
git clone https://github.com/your-organization/movieshop.git

# 2. Navigate into the project
cd movieshop

# 3. See all branches (local and remote)
git branch -a

# 4. Create and switch to your feature branch
git checkout -b feature/admin-dashboard

# 5. Verify you're on the correct branch
git branch
# Should show: * feature/admin-dashboard

# 6. Set upstream tracking (connects local branch to remote)
git push -u origin feature/admin-dashboard
```

## 📝 Daily Development Workflow

### **Start Your Day - Get Latest Updates**

```bash
# 1. Switch to main branch
git checkout main

# 2. Pull latest changes from remote main
git pull origin main

# 3. Switch back to your feature branch
git checkout feature/admin-dashboard

# 4. Merge main into your branch (get team updates)
git merge main

# OR rebase (cleaner history, but use carefully)
git rebase main
```

### **Work on Your Code - Save Progress Locally**

```bash
# 1. Check what files you've changed
git status

# 2. See exactly what changed in each file
git diff

# 3. Add specific files to staging
git add src/components/admin-dashboard.tsx
git add src/lib/admin-utils.ts

# 4. Add all changed files (careful with this!)
git add .

# 5. Commit with a meaningful message
git commit -m "feat: add admin dashboard sidebar layout"

# 6. Commit with detailed message (multi-line)
git commit -m "feat: implement order management table

- Add sorting and filtering to orders table
- Implement status badge component
- Add pagination for large datasets
- Fix responsive layout issues"

# 7. See your commit history
git log --oneline
```

### **Push Your Work to Remote**

```bash
# 1. Push your commits to the remote branch
git push origin feature/admin-dashboard

# After first push, you can just do:
git push

# 2. If someone else pushed to your branch (unlikely but possible)
git pull --rebase
git push
```

## 🔄 Keeping Your Branch Updated

### **Scenario 1: Teammate merged code to main**

```bash
# Method 1: Merge (creates merge commit)
git checkout feature/admin-dashboard
git merge main
git push

# Method 2: Rebase (cleaner history, no merge commit)
git checkout feature/admin-dashboard
git rebase main
git push --force-with-lease  # Careful with force push!
```

### **Scenario 2: Your branch has conflicts with main**

```bash
# 1. Try to merge main
git merge main

# 2. If conflicts appear, Git will tell you
# CONFLICT in src/components/sidebar.tsx

# 3. Check which files have conflicts
git status

# 4. Open conflicted files and resolve manually
# Look for markers: <<<<<<<, =======, >>>>>>>

# 5. After resolving, mark as resolved
git add src/components/sidebar.tsx

# 6. Complete the merge
git commit -m "merge: resolve conflicts with main"

# 7. Push resolved changes
git push
```

## 🎯 Creating a Pull Request

### **Method 1: Via Command Line (using gh CLI)**

```bash
# 1. Install GitHub CLI first (one time)
# macOS: brew install gh
# Windows: winget install --id GitHub.cli
# Linux: sudo apt install gh

# 2. Authenticate with GitHub
gh auth login

# 3. Create pull request
gh pr create --title "feat: implement admin dashboard" \
  --body "## Changes
- Add admin dashboard layout
- Implement order management table
- Add statistics cards

## Testing
- Tested on Chrome and Firefox
- Responsive on mobile and desktop

## Screenshots
![screenshot](link-to-screenshot)" \
  --base main \
  --head feature/admin-dashboard

# 4. Open PR in browser
gh pr view --web
```

### **Method 2: GitHub Website (Most Common)**

```bash
# 1. Push your branch
git push origin feature/admin-dashboard

# 2. GitHub will show a URL in terminal
# remote: Create a pull request for 'feature/admin-dashboard' on GitHub:
# remote: https://github.com/org/movieshop/pull/new/feature/admin-dashboard

# 3. Open that URL in your browser

# 4. Fill out the PR form:
#    - Title: "feat: implement admin dashboard"
#    - Description: What changed, why, how to test
#    - Assign reviewers from your team
#    - Add labels (enhancement, feature)
#    - Link related issues
```

## 👥 Collaborating with Teammates

### **Reviewing a Teammate's PR**

```bash
# 1. Fetch their branch
git fetch origin
git checkout -b teammate/feature-branch origin/teammate/feature-branch

# 2. Test their changes locally
npm run dev

# 3. Add your review comments (on GitHub website)

# 4. Approve or request changes via GitHub UI

# 5. Switch back to your branch
git checkout feature/admin-dashboard
```

### **Getting Feedback on Your PR**

```bash
# 1. When teammate requests changes, make updates
git checkout feature/admin-dashboard

# 2. Make the requested changes in your code

# 3. Commit fixes
git add .
git commit -m "fix: address PR feedback - improve error handling"

# 4. Push updates (PR updates automatically)
git push

# 5. Comment on PR that changes are ready for re-review
```

## ✅ After PR is Approved & Merged

```bash
# 1. Switch to main branch
git checkout main

# 2. Pull the latest changes (including your merged PR)
git pull origin main

# 3. Delete your local feature branch
git branch -d feature/admin-dashboard

# 4. Delete remote feature branch (optional, cleanup)
git push origin --delete feature/admin-dashboard

# 5. Create new branch for next feature
git checkout -b feature/user-profile
```

## 🚨 Emergency / Recovery Commands

### **Undo Mistakes**

```bash
# 1. Unstage a file (keep changes)
git reset HEAD src/components/file.tsx

# 2. Discard changes in a file (WARNING: permanent!)
git checkout -- src/components/file.tsx

# 3. Undo last commit but keep changes
git reset --soft HEAD~1

# 4. Undo last commit and discard changes (WARNING!)
git reset --hard HEAD~1

# 5. Amend last commit message
git commit --amend -m "new commit message"

# 6. Add forgotten file to last commit
git add forgotten-file.ts
git commit --amend --no-edit
```

### **Fix Branch Issues**

```bash
# 1. If you committed to main by mistake
git checkout -b feature/admin-dashboard  # Create branch at current position
git checkout main
git reset --hard origin/main  # Reset main to remote state

# 2. If your branch is behind remote
git fetch origin
git reset --hard origin/feature/admin-dashboard

# 3. Stash changes temporarily (to switch branches)
git stash push -m "WIP: dashboard table"
git checkout main
# Do something...
git checkout feature/admin-dashboard
git stash pop  # Restore changes

# 4. See stashed items
git stash list

# 5. Apply specific stash
git stash apply stash@{1}
```

## 📊 Useful Status & Info Commands

```bash
# 1. See branch status
git status

# 2. See commit history
git log --oneline --graph --all

# 3. See what you've changed (unstaged)
git diff

# 4. See what's staged (ready to commit)
git diff --staged

# 5. See remote branches
git branch -r

# 6. See all branches (local + remote)
git branch -a

# 7. See which files are ignored
git status --ignored

# 8. See commits on your branch not in main
git log main..feature/admin-dashboard

# 9. See commits on main not in your branch
git log feature/admin-dashboard..main
```

## 🏷️ Best Practices - Commit Message Convention

```bash
# Use conventional commits format:

# feat: new feature
git commit -m "feat: add admin dashboard statistics cards"

# fix: bug fix
git commit -m "fix: correct order total calculation"

# docs: documentation changes
git commit -m "docs: update README with setup instructions"

# style: code style (formatting, missing semicolons)
git commit -m "style: format admin dashboard code"

# refactor: code change that neither fixes bug nor adds feature
git commit -m "refactor: extract order table into separate component"

# test: adding or updating tests
git commit -m "test: add unit tests for admin utils"

# chore: maintenance tasks
git commit -m "chore: update dependencies"

# perf: performance improvements
git commit -m "perf: lazy load order details sheet"

# ci: CI/CD related changes
git commit -m "ci: add GitHub Actions workflow"

# BREAKING CHANGE: breaking changes
git commit -m "feat!: redesign dashboard layout"

# Add scope for clarity
git commit -m "feat(admin): add user management table"
git commit -m "fix(dashboard): correct statistics calculation"
```

## 🎯 Quick Reference Cheat Sheet

| Task | Command |
|------|---------|
| **Start new feature** | `git checkout -b feature/name` |
| **Check status** | `git status` |
| **Add files** | `git add .` or `git add file.ts` |
| **Commit** | `git commit -m "message"` |
| **Push to remote** | `git push origin feature/name` |
| **Get latest main** | `git checkout main && git pull` |
| **Update your branch** | `git merge main` |
| **Create PR** | `gh pr create` or GitHub website |
| **Delete branch** | `git branch -d feature/name` |
| **Stash changes** | `git stash` |
| **Apply stash** | `git stash pop` |

## 🚦 Complete Daily Workflow Script

Save this as `git-workflow.sh`:

```bash
#!/bin/bash
# Daily Git workflow for team collaboration

echo "🔄 Starting daily Git workflow..."

# 1. Save current work if needed
echo "💾 Stashing any uncommitted changes..."
git stash push -m "auto-stash before daily sync"

# 2. Update main branch
echo "📥 Updating main branch..."
git checkout main
git pull origin main

# 3. Update your feature branch
echo "🔄 Updating your feature branch..."
git checkout feature/admin-dashboard

# 4. Merge latest main
echo "🔀 Merging main into your branch..."
git merge main

# 5. Apply stashed changes
echo "📂 Restoring your work..."
git stash pop

# 6. Show status
echo "✅ Current status:"
git status

echo "🎉 Ready to work!"
```

## 🎓 Pro Tips for Team Collaboration

1. **Always pull before pushing**: `git pull` before `git push`
2. **Write clear commit messages**: Your future self will thank you
3. **Pull request early**: Even if not finished, create draft PR for visibility
4. **Keep PRs small**: 200-400 lines max, easier to review
5. **Don't force push to shared branches**: Use `--force-with-lease` if you must
6. **Review your own PR first**: Catch obvious mistakes
7. **Link issues**: Use `Closes #123` in PR description
8. **Resolve conflicts locally**: Use VSCode or your IDE's merge tool

## 🔗 Useful Git GUI Tools

```bash
# Built-in Git GUI
git gui

# Built-in history browser
gitk

# VS Code integration (open repo in VS Code)
code .

# GitHub Desktop (download separately)
# macOS: brew install --cask github
```

**Remember**: Always communicate with your team before force pushing or rebasing shared branches! 🤝