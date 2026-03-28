import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express();
const originPort = process.env.ORIGIN_PORT || 5173;
const port = process.env.PORT || 3000;

const USERS = {
    kartikey: { id: 1, username: "kartikey", password: "secret" },
    jace: { id: 2, username: "jace", password: "racer" }
};

const sessions = {};
const tokens = {}

function makeSessionId() {
    return crypto.randomUUID();
}

app.use(cors({
    origin: `http://localhost:${originPort}`,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

//POST Login - /login
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = USERS[username];

    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const sessionId = makeSessionId();
    sessions[sessionId] = { id: user.id, username: user.username };

    res.cookie("session_id", sessionId, {
        httpOnly: true,
        path: "/",
        // secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24
    });
    res.json({ message: "Login successful", username: user.username });
});

//GET Profile - /me
app.get("/me", (req, res) => {
    const sessionId = req.cookies.session_id;
    if (!sessionId || !sessions[sessionId]) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user: sessions[sessionId] });
})

//POST Logout - /logout
app.post("/logout", (req, res) => {
    const sessionId = req.cookies.session_id;

    if (!sessionId || !sessions[sessionId]) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    delete sessions[sessionId];

    res.clearCookie("session_id", { path: "/" });

    res.json({ message: "Logout successful" });
});

// POST /token-login

app.post("/token-login", (req, res) => {
    const { username, password } = req.body;
    const user = USERS[username];

    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = makeSessionId();
    tokens[token] = { id: user.id, username: user.username };

    res.json({ token });
});

// GET /token-protected
app.get("/token-protected", (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }
    const token = authHeader.split(" ")[1];

    if (!token || !tokens[token]) {
        return res.status(401).json({ error: "Invalid token" });
    }
    res.json({ user: tokens[token], authMethod: "bearer-token" });
});



app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port} `);
});
