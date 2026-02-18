# Handling Merge Conflicts

Conflicts happen when two people (or two branches) change the same lines of code.

## Resolution Strategy
1. **Identify**: Git will block the merge and tell me which files have conflicts.
2. **Open**: Open the conflicted file in VS Code.
3. **Locate**: Look for the conflict markers:
```
    <<<<<<< HEAD
    My changes
    =======
    Incoming changes
    >>>>>>> branch-name
```
4. **Decide**: Choose which code is correct (Current, Incoming, or a mix of both).
5. **Clean**: Delete the marker lines (`<<<`, `===`, `>>>`).
6. **Commit**: 
- `git add <file>`
- `git commit -m "fix: resolve merge conflict in <file>"`