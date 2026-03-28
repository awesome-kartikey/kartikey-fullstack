import express from "express";
import { createServer } from "http";

const app = express();

app.get("/", (req, res) => {
  res.send(`Handled by Worker PID: ${process.pid}`);
});

const server = createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on PID: ${process.pid}`);
});

process.on("SIGINT", () => {
  console.log(`[SIGINT] Shutting down worker ${process.pid}`);
  server.close(() => process.exit(0));
});
