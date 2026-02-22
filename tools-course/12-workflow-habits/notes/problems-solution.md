# Debugging Log

## Issue: AWS Site Timeout
- **Context:** Launched Caddy on AWS, but browser says "Site can't be reached".
- **Error:** Connection Timed Out (Browser).
- **What I Tried:**
  - SSH'd in and ran `curl localhost:80` -> It worked inside the server.
  - Checked Caddy status -> Running.
- **Solution:** Go to AWS Console -> Security Groups -> Edit Inbound Rules -> Add Rule (HTTP, TCP, 80, 0.0.0.0/0).
- **Lesson:** AWS blocks everything by default. I must explicitly open the "door".

## Issue: Permission Denied on Script
- **Context:** Created `deploy.sh` but cannot run `./deploy.sh`.
- **Error:** `bash: ./deploy.sh: Permission denied`
- **Solution:** Run `chmod +x deploy.sh`.
- **Lesson:** New text files are not executable programs by default in Linux.