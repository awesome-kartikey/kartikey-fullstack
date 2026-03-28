import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

console.log("*******API Server Configuration*******");
console.log("NODE_ENV        :", process.env.NODE_ENV);
console.log("PORT            :", process.env.PORT);
console.log("FRONTEND_ORIGIN :", process.env.FRONTEND_ORIGIN);
console.log("****************************************");

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.get("/status", (req, res) => {
    res.json({
        status: "ok",
        enviorment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});


app.post("/echo", (req, res) => {
    res.json({
        received: req.body,
        origin: req.headers.origin || "none",
        method: req.method,
    });
});

app.get("/protected", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== "Bearer secret-token") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ message: "Access granted", user: "demo-user" });
});

app.get("/static/script.js", (req, res) => {
    res.set("Cache-Control", "max-age=3600, immutable");
    res.set("Content-Type", "application/javascript");
    res.send('console.log("bundle version: a3f8c2b1");');
});

app.get("/live-data", (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({
        price: (Math.random() * 100).toFixed(2),
        timestamp: new Date().toISOString(),
    });
});

app.get("/set-cookie", (req, res) => {
    res.cookie("session_token", "abc123", {
        httpOnly: true,
        sameSite: "Lax",
        path: "/",
    });
    res.json({ message: "Cookie set. Check DevTools > Application > Cookies." });
});

app.listen(PORT, () => {
    console.log(`API server → http://localhost:${PORT}`);
});