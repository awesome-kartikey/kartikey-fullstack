# Shell Basics Notes

## Safety Awareness
- **rm -rf**: This command is extremely dangerous because `-r` deletes folders and contents **recursively**, and `-f` **forces** the action without a confirmation prompt. Running it in the wrong location (like the root directory `/`) can permanently delete your entire system.
- **sudo**: This grants **root (administrator) privileges**. It should be avoided unless absolutely necessary because running an incorrect or malicious command with `sudo` can permanently damage core system files, leading to a broken operating system.

## Data Playground Findings
I created a file with 100 lines.
- Command to count lines: `wc -l server_logs.txt` -> Result: 100
- Command to find lines containing "50" and count them: `grep "50" server_logs.txt | wc -l` -> Result: 1
- Command to see the first 5 lines: `head -n 5 server_logs.txt`
- Command to see the last 5 lines: `tail -n 5 server_logs.txt`
