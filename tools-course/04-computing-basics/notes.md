# Computing Basics Notes

## Key Commands
- whoami / echo $HOME — identify current user and home directory
  - whoami — kartikey
  - echo $HOME — /home/kartikey
- ps aux — list all running processes with PID and owner
  - Process that I recognize:
    - 64648 pts/2    00:00:00 bash
    - 64885 pts/2    00:00:00 ps
- `echo 'echo "Hello from the script"' > hello.sh`
    - `./hello.sh`
- lsof -i :PORT — find which process is using a specific port
- kill <PID> — stop a process by its ID
- chmod +x file — make a file executable
- ls -l — view file permissions

## Permissions
Format: rwxr-xr--
- First 3 (rwx) = owner can read, write, execute
- Next 3 (r-x) = group can read and execute
- Last 3 (r--) = others can only read
  
- **Octal Shortcuts:**
  - `7` (4+2+1) = `rwx` (Full)
  - `5` (4+0+1) = `r-x` (Read/Execute)
  - `4` (4+0+0) = `r--` (Read Only)
- **Example:** `chmod 755 hello.sh` sets it to `-rwxr-xr-x` (Safe for scripts).
- **Risk:** Avoid `chmod 777` (World-Writable); it allows anyone to modify your files.

## Why Not sudo for Everything
Running as root means one wrong command can delete system files,
overwrite configs, or open security holes. Non-root users limit the mistakes.

## Networking & Servers
- `python3 -m http.server 8000` — Starts a temporary web server in the current folder.
- **Port Conflict:** Only one process can "bind" to a port (e.g., 3000) at a time. 
- **The Fix:** If you see **`OSError: [Errno 98] Address already in use`**, run `lsof -i :3000` to find the PID, then `kill <PID>`.