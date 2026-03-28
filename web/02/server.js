import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/profile', (req, res) => {
    // res.status(500).json({ error: 'Server error' });

    if (req.query.fail === '1') {
        return res.status(500).json({ error: 'Forced server error for debugging' });
    }

    res.setHeader('X-Debug-Trace', `request-${Date.now()}`);

    // res.setHeader('Cache-Control', 'max-age=300');

    res.setHeader('Cache-Control', 'no-store');

    res.json({
        name: 'Kartikey',
        email: 'kartikey@gmail.com'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});