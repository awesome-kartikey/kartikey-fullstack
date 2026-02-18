# Git and GitHub Setup Notes

## Global Configuration
These commands set my identity for all commits:
- `git config --global user.name "Kartikey Kumar"`
- `git config --global user.email "kartikeykumar.onglobe@gmail.com"`
- `git config --global core.editor "code --wait"` (Sets VS Code as default editor)

## SSH Key Setup
To connect to GitHub without passwords:
1. Generate key: `ssh-keygen -t ed25519 -C "kartikeykumar.onglobe@gmail.com"`
2. Start agent: `eval "$(ssh-agent -s)"`
3. Add key: `ssh-add ~/.ssh/id_ed25519`
4. Copy public key: `cat ~/.ssh/id_ed25519.pub`
5. Paste into GitHub Settings -> SSH and GPG Keys.

## Binary Files Policy
**Rule:** Do not commit binary files (executables, images, zip files, node_modules).
**Why?**
1. **Size:** They bloat the repository size significantly.
2. **Diffs:** Git cannot show line-by-line changes for binaries, making version control useless.
3. **Conflicts:** Merging binary conflicts is nearly impossible.

**Action:** Always add these to `.gitignore`.