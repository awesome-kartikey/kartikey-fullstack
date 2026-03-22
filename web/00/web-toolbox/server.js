import express from "express";
const app = express();

app.get("/", (req, res) => {
  console.log("Request received for /", req.method);
  res.send("<h1>Hello from the toolbox</h1>");
});

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/status", (req, res) => {
  res.json({ status: "ok", version: "1.0" });
});

app.get("/api/unknown", (req, res) => {
  res.json({ message: "This route now exists" });
});

app.get("/api/missing", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen("3000", () => {
  console.log("Server running on http://localhost:3000");
});
// app.listen('three-thousand', () => {
//   console.log("Server running on http://localhost:three-thousand");
// });
