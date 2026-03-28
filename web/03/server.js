import express from "express";
import cors from "cors";

const app = express();

const users = {
    1: { id: 1, name: 'Dev', role: 'admin' },
    2: { id: 2, name: 'Nas', role: 'member' },
};

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const user = users[id];

    if (!user) {
        return res.status(404).json({ error: 'User not found', id });
    }
    // if (!user) {
    //     return res.status(404).send('<html><body><h1>Not Found</h1></body></html>');
    // }

    res.status(200).json(user);
});

app.post("/echo", (req, res) => {
    res.status(201).json(req.body);
});

app.get("/set-theme-cookie", (req, res) => {
    res.cookie("theme", "dark", { path: "/" });
    res.status(200).json({ message: 'Cookie set' });
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});