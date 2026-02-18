# My Git Workflow

## The Core Loop
I will follow this loop for every feature or fix:

1. **Edit**: Make changes to the code in VS Code.
2. **Status**: Check what changed.
   - Command: `git status`
3. **Stage**: specific files to be committed.
   - Command: `git add <filename>` (or `git add .` for all)
4. **Commit**: Save the snapshot with a descriptive message.
   - Command: `git commit -m "verb: description of change"`
5. **Push**: Upload changes to GitHub.
   - Command: `git push origin main`
6. **Pull Request**: Ask a teammate to review changes before merging.

## Inspecting History
To understand what happened in the past:

- **`git log`**: Shows a list of recent commits (hash, author, date, message).
- **`git diff`**: Shows exactly what lines changed before I stage them.
- **`git show <commit-hash>`**: Shows the specific changes in a past commit.

## Comit Message Format

 -  `feat`: New feature
 -  `fix`: Bug fix
 -  `docs`: Documentation changes
 -  `style`: Formatting, missing semi colons, etc.
 -  `refactor`: Refactoring code, renaming things
 -  `test`: Adding missing tests, refactoring tests.
 -  `chore`: Updating build tasks, package manager configs, etc.