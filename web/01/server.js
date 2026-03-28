import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = 3000;

// app.get("/app.js", (req, res) => {
//   res.send("<html>wrong content</html>");
// });

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

app.get("/old-home", (req, res) => {
  res.redirect(302, "/");
});

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

app.use((req, res) => {
  res.type("text/css");
  // res.status(200).send("body { background: pink; }");
  res.status(404).send("body { background: pink; }");
  // res.status(404).send("<h1>404 - Not Found</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
