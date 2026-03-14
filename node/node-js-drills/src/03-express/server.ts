// Drill Set 1: Hello Express¶
// Create an Express app that responds to / with "Hello Express."
// Add a /ping route returning JSON { ok: true }.
// Use app.listen with port from process.env.PORT || 3000.
// Test with curl: curl http://localhost:3000/ping.
// Add graceful shutdown with SIGINT handler.
// import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import userRouter from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";
import { loggerMiddleware } from "./middleware/logger";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Add middleware that logs method and url for every request.
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

const server = app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

app.use("/api/users", userRouter);

app.get("/search", (req, res) => {
  const q = req.query.q;
  res.json({ q });
});

app.post("/echo", (req, res) => {
  res.json(req.body);
});

// Return different status codes (200, 201, 400, 404).
app.post("/items", (req, res) => {
  res.status(201).json({ message: "Item created", item: req.body });
});

app.get("/bad", (req, res) => {
  res.status(400).json({ message: "Bad Request" });
});

//Set custom headers in responses.
app.get("/headers", (req, res) => {
  res.set("X-Custom-Header", "hello-world").json({ ok: true });
});

// Return both JSON and plain text from different routes.
app.get("/data", (req, res) => {
  res.json({ message: "This is JSON" });
});

app.get("/text", (req, res) => {
  res.type("text/plain").send("This is plain text");
});

//Add a route that sends a file with res.sendFile().
app.get("/file", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

//Use res.redirect() for a redirect route.
app.get("/old-page", (req, res) => {
  res.redirect("/new-page"); // 302(temporary) or 301(permanent)
});

app.get("/new-page", (req, res) => {
  res.send("You were redirected here!");
});

function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.get("x-api-key");
  if (!apiKey || apiKey !== "secret-key") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

app.get("/protected", apiKeyMiddleware, (req, res) => {
  res.json({ message: "Protected route" });
});

app.get("/public", (req, res) => {
  res.json({ message: "Public route" });
});

//Demonstrate middleware execution order.
app.get(
  "/order",
  (req, res, next) => {
    console.log("Middleware 1");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 2");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 3");
    res.json({ message: "Middleware order demo" });
  },
);

app.get("/async-crash", async (req, res, next) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      throw new Error("Async crash");
    }, 1000);
  });
});

app.use(express.static(path.join(__dirname, "public")));

// Add basic CORS headers manually
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const publicCors = cors();
const privateCors = cors({ origin: "https://192.168.1.1:5000" });

app.get("/cors", publicCors, (req, res) => {
  res.json({ message: "Public CORS" });
});

app.get("/private-cors", privateCors, (req, res) => {
  res.json({ message: "Private CORS" });
});

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down...");
  server.close();
  process.exit(0);
});

export default app;
