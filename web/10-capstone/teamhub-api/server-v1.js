import express from "express";
import cookieParser from "cookie-parser";
import { projects, articles, team } from "../data";

const app = express();
const PORT = 3000;

app.use(cookieParser());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.type("html").send(`
        <!doctype html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TeamHub</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; background: #f7f7fb; color: #1f2937; }
            h1 { margin-top: 0; }
            nav { margin: 1rem 0 2rem; }
            nav a { margin-right: 1rem; color: #2563eb; text-decoration: none; }
            .cards { display: grid; grid-template-columns: repeat(3, minmax(180px, 1fr)); gap: 1rem; }
            .card { background: white; border: 1px solid #d1d5db; border-radius: 12px; padding: 1rem; }
            .label { font-size: 0.9rem; color: #6b7280; }
            .value { font-size: 2rem; font-weight: bold; margin-top: 0.5rem; }
        </style>
        </head>
        <body>
        <h1>TeamHub</h1>
        <p>Local engineering intranet.</p>

        <nav>
            <a href="/projects">Projects</a>
            <a href="/articles">Articles</a>
            <a href="/team">Team</a>
        </nav>

        <section class="cards">
            <div class="card">
            <div class="label">Projects</div>
            <div class="value" id="project-count">${projects.length}</div>
            </div>
            <div class="card">
            <div class="label">Articles</div>
            <div class="value">${articles.length}</div>
            </div>
            <div class="card">
            <div class="label">Team size</div>
            <div class="value">${team.length}</div>
            </div>
        </section>

        <script>
            window.addEventListener('load', async () => {
            const projectCountEl = document.getElementById('project-count')

            try {
                const response = await fetch('/api/projects')

                if (!response.ok) {
                throw new Error('Projects request failed')
                }

                const liveProjects = await response.json()
                projectCountEl.textContent = String(liveProjects.length)
            } catch (error) {
                projectCountEl.textContent = 'Projects unavailable'
            }
            })
        </script>
        </body>
        </html>`);
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/articles", (req, res) => {
  res.json(articles);
});

app.get("/api/team", (req, res) => {
  res.json(team);
});

app.listen(PORT, () => {
  console.log(`TeamHub API running at http://localhost:${PORT}`);
});
