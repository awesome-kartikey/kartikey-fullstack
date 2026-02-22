# Concepts & Mental Models

## Concept: Reverse Proxy (Caddy/Nginx)
- **Definition:** A server that sits *in front* of my application. Clients talk to the Proxy, and the Proxy talks to my App.
- **Why use it?:** It handles security (HTTPS) and routing so my app code doesn't have to.
- **Analogy:** A receptionist at an office. Visitors talk to the receptionist, who directs them to the right person. The visitors don't walk directly to my desk.
- **Related Commands:** `caddy reverse-proxy`, `systemctl status caddy`

## Concept: SSH Identity File
- **Definition:** The private half of the key pair (`id_ed25519`). It acts like a physical key to unlock the server.
- **Crucial Rule:** Never share this file. The `.pub` file is the lock (public), the file without extension is the key (private).

## Concept: Shared Libraries (`.so`) & LD_LIBRARY_PATH

* **Definition:** `.so` (Shared Object) files are dynamically linked libraries used by Linux programs at runtime.
* **Why they exist:** Multiple programs share the same compiled code in memory, saving RAM and disk space.
* **Dynamic Linking:** When a program starts, the dynamic linker loads required `.so` files.
* **LD_LIBRARY_PATH:** An environment variable that tells the system where to look for shared libraries *before* default system paths.
* **Rule:** Avoid relying on `LD_LIBRARY_PATH` in production. Use `ldconfig` and proper installation paths instead.

**Mental Model:**

* Program = Brain
* `.so` = Skill modules
* Dynamic linker = Librarian
* `ldconfig` = Library index builder


## Concept: Process Hierarchy (PID & PPID)

* Every process has:

  * **PID** (Process ID)
  * **PPID** (Parent Process ID)

* Processes form a tree structure.

* Parent process creates child processes.

**Example Workflow:**

1. Find process using `ps`
2. Identify PPID
3. Inspect parent process

**Why important?**
Used for debugging crashes, orphan processes, or port conflicts.