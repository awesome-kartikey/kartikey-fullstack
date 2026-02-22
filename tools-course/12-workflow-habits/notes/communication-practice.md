# Communication Drills: Asking Better Questions

## Scenario: Caddy won't start
**Bad Question:** "Caddy is broken. Help."

**Professional Question:**
**Context:** I am trying to host my static site on AWS using Caddy.
**Expected:** When I run `caddy run`, I expect the server to start on port 80.
**Actual:** I get an error `Error: listening on :80: permission denied`.
**What I Tried:**
1. Checked if another service is running on port 80 using `lsof -i :80` (Result: Empty).
2. Checked my user permissions using `whoami` (Result: 'awskartikey').
**My Guess:** Does Caddy need `sudo` privileges to use port 80?

## Scenario: Git Merge Conflict
**Context:** Merging `feature-login` into `main`.
**Actual:** Git says "Automatic merge failed".
**What I Tried:** I opened the file and see `<<<< HEAD` markers.
**Question:** Should I manually delete these markers and keep both code blocks, or pick just one?