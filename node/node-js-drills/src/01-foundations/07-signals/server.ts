// Run a server and stop it with Ctrl+C.
// Add a handler for SIGINT that logs a message.
// Add a handler for SIGTERM.
// Ensure the server closes before exit.
// Write a script that logs “goodbye” before terminating.

import http from "http";

const server = http.createServer((req, res) => {
  res.end("Hello, Node.js\n");
});

server.listen(3999, () => {
  console.log("Server running at http://localhost:3999/");
  console.log("PID", process.pid);
});

process.on("SIGINT", () => {
  console.log("Received SIGINT");
  server.close(() => {
    console.log("Server closed Goodbye");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  server.close(() => {
    console.log("Server closed Goodbye");
    process.exit(0);
  });
});
