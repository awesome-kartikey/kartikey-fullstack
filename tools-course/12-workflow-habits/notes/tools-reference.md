# Tools & Commands Reference

## 🐧 Linux & Shell (The "Daily Drivers")

### File & Folder Manipulation
- **`mkdir -p a/b/c`**: Create nested directories in one go (no more "no such file" errors).
- **`ls -lah`**: List **a**ll files (hidden ones), in **l**ist format, with **h**uman readable sizes (MB/GB).
- **`cp -r source/ dest/`**: Copy a folder recursively.
- **`rm -rf folder/`**: **DANGER**. Force delete a folder. Double-check path before hitting Enter.
- **`mv old.txt new.txt`**: Rename or move a file.

---

### Searching & text
- **`grep -r "string" .`**: Search for "string" inside **every file** in the current directory.
- **`cat file.txt | grep "Error"`**: Pipe output to filter for errors.
- **`head -n 20 log.txt`**: View the *first* 20 lines.
- **`tail -n 20 log.txt`**: View the *last* 20 lines (great for recent logs).
- **`echo "text" > file.txt`**: **Overwrite** file with text.
- **`echo "text" >> file.txt`**: **Append** text to end of file.

--- 

### Disk Usage & Storage

* **`du -sh folder/`**: Show total size of folder.
* **`du -h --max-depth=1`**: Show size of subfolders.
* **`df -h`**: Show disk space usage of mounted filesystems.

---

### Mount Points

* **`findmnt`**: Show mounted filesystems cleanly.
* **`mount`**: Low-level mount info.
* **`df -h /path`**: See which filesystem a path belongs to.

---

### Finding Files & Directories

* **`find . -name "file.txt"`**: Search file by name.
* **`find . -type d -name "project"`**: Find directories only.
* **`find . -type f -name "*.js"`**: Find files by extension.
* **`locate filename`**: Fast search (uses database).

---

### Viewing Files

* **`ls -lah`**: List all files with details.
* **`tree -L 2`**: View folder structure up to 2 levels.
* **`less file.txt`**: Safely read large files.
* **`cat file.txt`**: Print small file to terminal.

---

### Processes & Debugging

* **`ps aux`**: List all processes.
* **`ps -eo pid,ppid,cmd`**: Show process tree data.
* **`pstree`**: Visual process hierarchy.
* **`kill PID`**: Graceful stop.
* **`kill -9 PID`**: Force stop (last resort).

Example debugging:

```bash
ps aux | grep chrome
ps -fp <PPID>
```

---
---

## ⚙️ System & Processes (The "Why is it broken?" Kit)

### Permissions
- **`chmod +x script.sh`**: Make a script executable.
- **`chmod 600 config.yaml`**: Make a file read/write for **me only** (secure for secrets).
- **`sudo chown user:user file`**: Fix ownership if you accidentally created a file with `sudo`.

### Processes & Ports
- **`ps aux | grep node`**: Find the Process ID (PID) of running node apps.
- **`lsof -i :8080`**: "List Open Files" - See exactly who is using port 8080.
- **`kill <PID>`**: Ask a process to stop nicely.
- **`kill -9 <PID>`**: **Force kill** a stuck process (use as last resort).
- **`htop`**: A visual task manager for the terminal (easier to read than `top`).

---
---

## 🐙 Git (The "Time Machine")

### Workflow
- **`git status`**: Your GPS. Run this before and after every command.
- **`git log --oneline --graph --all`**: See a visual tree of commits and branches.
- **`git diff`**: See exactly what lines changed *before* you add them.

### Fixes & Undos
- **`git commit --amend -m "new msg"`**: Change the message of the last commit (if you haven't pushed yet).
- **`git checkout -`**: Switch back to the *previous* branch you were on (like Alt-Tab).
- **`git restore .`**: Discard **all** local changes (Danger: equivalent to "Don't Save").
- **`git stash`**: Temporarily hide changes so you can switch branches cleanly. `git stash pop` brings them back.

---
---

## ☁️ Cloud & Networking (AWS/Remote)

### Connecting
- **`ssh user@ip`**: Standard login.
- **`ssh myserver`**: Login using your `~/.ssh/config` alias (Faster!).
- **`curl -v http://localhost:3000`**: "See" a website from the terminal. `-v` shows Headers (useful for debugging API errors).

### File Transfer
- **`scp local-file.txt myserver:~/remote-folder/`**: Push file UP to server.
- **`scp myserver:~/remote-file.txt .`**: Pull file DOWN from server.
- **`tar -czvf backup.tar.gz folder/`**: Compress a folder before transferring (saves time).

---
---

## 📦 Data Formats (JSON/YAML)

- **`cat data.json | jq .`**: Pretty-print JSON so it's readable with colors.
- **`cat data.json | jq .key`**: Extract just the value of "key".
- **YAML Formatting**: Indentation is usually **2 spaces**. Never use Tabs.
- **.env Rule**: Variables are `KEY=VALUE`. No spaces around the `=`.

---

## ⌨️ VS Code Shortcuts (Muscle Memory)

- **`Ctrl + P`**: Quick Open (Find file by name).
- **`Ctrl + Shift + P`**: Command Palette (Do anything).
- **`Ctrl + ~`** (Backtick): Toggle Integrated Terminal.
- **`Alt + Up/Down`**: Move current line up/down.
- **`Ctrl + /`**: Comment/Uncomment code block.

---

###  The "Golden Rules" of the Terminal
1.  **Tab is your best friend:** Always hit `Tab` to autocomplete filenames. It prevents typos.
2.  **Ctrl+R:** Search your command history. Don't retype long commands.
3.  **Read the Error:** The answer is usually in the error message. Don't just ignore it.