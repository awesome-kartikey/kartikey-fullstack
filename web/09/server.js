import express from "express";

const app = express();
const PORT = 3000;

app.use("/before", express.static("public", {
  setHeaders: (res, path, stat) => {
    res.set("Cache-Control", "no-store");
  }
}));
app.use("/after", express.static("public", {
  setHeaders: (res, path, stat) => {
    // if (path.endsWith(".js") || path.endsWith(".css")) {
    //   res.set("Cache-Control", "public, max-age=31536000, immutable");
    // }
  }
}));

app.get("/api/before/dashboard", (req, res) => {
  setTimeout(() => {
    res.json({
      user: "Kartikey",
      tasks: 42,
      notes: 17,
      lastLogin: new Date().toISOString(),
    });
  }, 300);
});

app.get("/api/after/dashboard", (req, res) => {
  setTimeout(() => {
    res.set("Cache-Control", "public, max-age=10");
    res.json({
      user: "Kartikey",
      tasks: 42,
      notes: 17,
      lastLogin: new Date().toISOString(),
    });
  }, 300);
});

app.get("/", (req, res) => {
  res.redirect("/before/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
