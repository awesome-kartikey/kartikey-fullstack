# Concurrency Strategy in Node.js

## 1. Process Clustering (Horizontal Scaling via PM2)
- **What it is:** Running multiple separate instances of the Node.js event loop on different CPU cores.
- **Memory:** Each process has its own memory space (V8 heap). They cannot share variables.
- **Use Case:** Scaling a typical Express web server to handle thousands of concurrent I/O HTTP requests.

## 2. Worker Threads (Vertical Scaling)
- **What it is:** Spawning a background thread within the *same* Node process.
- **Memory:** Threads can share memory using `SharedArrayBuffer`.
- **Use Case:** Offloading a single, heavy CPU task (like calculating Fibonacci, generating a PDF, or resizing an image) so it doesn't block the main Express event loop.

**Rule of Thumb:**
- Use **PM2 Clusters** to handle *more total users*.
- Use **Worker Threads** to handle *heavy math/data processing* for a single user without freezing the server for everyone else.
