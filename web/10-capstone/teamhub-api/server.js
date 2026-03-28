import express from "express";
import cookieParser from "cookie-parser";
import { projects, articles, team } from "../data.js";

const app = express();
const PORT = 3000;

app.use(cookieParser());

app.use(express.static("public"));

function getMemberById(id) {
  return team.find((member) => member.id === id);
}

function getMemberName(id) {
  const member = getMemberById(id);
  return member ? member.name : "Unknown";
}

function pageTemplate(title, body, extraScript = "") {
  return `<!doctype html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; background: #f7f7fb; color: #1f2937; }
              h1, h2, h3 { margin-top: 0; }
              nav { margin: 1rem 0 2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
              nav a { color: #2563eb; text-decoration: none; }
              .cards, .grid { display: grid; gap: 1rem; }
              .cards { grid-template-columns: repeat(3, minmax(180px, 1fr)); }
              .grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
              .card { background: white; border: 1px solid #d1d5db; border-radius: 12px; padding: 1rem; }
              .label { font-size: 0.9rem; color: #6b7280; }
              .value { font-size: 2rem; font-weight: bold; margin-top: 0.5rem; }
              .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.85rem; background: #e5e7eb; margin-left: 0.5rem; }
              ul { padding-left: 1.25rem; }
              code { background: #eef2ff; padding: 0.15rem 0.35rem; border-radius: 6px; }
            </style>
          </head>
          <body>
            <nav>
              <a href="/">Home</a>
              <a href="/projects">Projects</a>
              <a href="/articles">Articles</a>
              <a href="/team">Team</a>
            </nav>
            ${body}
            ${extraScript}
          </body>
          </html>
          `;
}

function renderProjectCard(project) {
  return `
    <article class="card">
      <h3>
        <a href="/projects/${project.id}">${project.name}</a>
        <span class="badge">${project.status}</span>
      </h3>
      <p><strong>Lead:</strong> ${getMemberName(project.lead)}</p>
      <p><strong>Tech:</strong> ${project.tech.join(", ")}</p>
      <p>${project.description}</p>
    </article>
  `;
}

function renderProjectsPage() {
  return pageTemplate(
    "TeamHub Projects",
    `
      <h1>Projects</h1>
      <p>This is the default projects page. In v3, compare this against the CSR and SSG variants.</p>
      <p>
        Variants:
        <a href="/projects/csr">CSR</a>,
        <a href="/projects/ssr">SSR</a>,
        <a href="/projects/static.html">SSG</a>
      </p>
      <section class="grid">
        ${projects.map(renderProjectCard).join("")}
      </section>
    `,
  );
}

app.get("/", (req, res) => {
  res.type("html").send(
    pageTemplate(
      "TeamHub",
      `
        <h1>TeamHub</h1>
        <p>Local engineering intranet.</p>

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
      `,
      `
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
      `,
    ),
  );
});

app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.get("/api/projects/:id", (req, res) => {
  const project = projects.find((item) => item.id === req.params.id);

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.json(project);
});

app.get("/api/articles", (req, res) => {
  res.json(articles);
});

app.get("/api/articles/:id", (req, res) => {
  const article = articles.find((item) => item.id === req.params.id);

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json(article);
});

app.get("/api/team", (req, res) => {
  res.json(team);
});

app.get("/people", (req, res) => {
  res.redirect(301, "/team");
});

app.get("/set-theme", (req, res) => {
  res.cookie("theme", "light", {
    httpOnly: true,
    path: "/",
  });

  res.json({ ok: true });
});

app.get("/projects", (req, res) => {
  res.type("html").send(renderProjectsPage());
});

app.get("/projects/ssr", (req, res) => {
  res.type("html").send(renderProjectsPage());
});

app.get("/projects/csr", (req, res) => {
  res.type("html").send(
    pageTemplate(
      "Projects CSR",
      `
        <h1>Projects (CSR)</h1>
        <p>This page starts as an HTML shell. JavaScript fetches the data after load.</p>
        <div id="project-list"></div>
      `,
      `
        <script>
          function renderProjectCard(project) {
            return \`
              <article class="card">
                <h3>
                  <a href="/projects/\${project.id}">\${project.name}</a>
                  <span class="badge">\${project.status}</span>
                </h3>
                <p><strong>Lead:</strong> \${project.leadName}</p>
                <p><strong>Tech:</strong> \${project.tech.join(', ')}</p>
                <p>\${project.description}</p>
              </article>
            \`
          }

          window.addEventListener('load', async () => {
            const list = document.getElementById('project-list')

            try {
              const response = await fetch('/api/projects')
              const items = await response.json()

              const withLeadNames = items.map((project) => {
                const leadMap = {
                  u1: 'Alice Nakamura',
                  u2: 'Ben Okafor',
                  u3: 'Carol Singh',
                  u4: 'Dan Park',
                  u5: 'Elena Russo'
                }

                return { ...project, leadName: leadMap[project.lead] || 'Unknown' }
              })

              list.innerHTML = '<section class="grid">' + withLeadNames.map(renderProjectCard).join('') + '</section>'
            } catch (error) {
              list.textContent = 'Projects unavailable'
            }
          })
        </script>
      `,
    ),
  );
});

app.get("/projects/:id", (req, res) => {
  const project = projects.find((item) => item.id === req.params.id);

  if (!project) {
    return res
      .status(404)
      .type("html")
      .send(
        pageTemplate(
          "Project not found",
          `<h1>Project not found</h1><p>No project exists for id <code>${req.params.id}</code>.</p>`,
        ),
      );
  }

  const members = project.team.map(getMemberName);

  res.type("html").send(
    pageTemplate(
      project.name,
      `
        <h1>${project.name}</h1>
        <p><strong>Status:</strong> ${project.status}</p>
        <p><strong>Lead:</strong> ${getMemberName(project.lead)}</p>
        <p><strong>Tech stack:</strong> ${project.tech.join(", ")}</p>
        <p>${project.description}</p>
        <h2>Team members</h2>
        <ul>
          ${members.map((name) => `<li>${name}</li>`).join("")}
        </ul>
      `,
    ),
  );
});

app.get("/articles", (req, res) => {
  res.type("html").send(
    pageTemplate(
      "Articles",
      `
        <h1>Articles</h1>
        <section class="grid">
          ${articles
            .map(
              (article) => `
                <article class="card">
                  <h3><a href="/articles/${article.id}">${article.title}</a></h3>
                  <p><strong>Author:</strong> ${getMemberName(article.author)}</p>
                  <p><strong>Date:</strong> ${article.date}</p>
                </article>
              `,
            )
            .join("")}
        </section>
      `,
    ),
  );
});

app.get("/articles/:id", (req, res) => {
  const article = articles.find((item) => item.id === req.params.id);

  if (!article) {
    return res
      .status(404)
      .type("html")
      .send(
        pageTemplate(
          "Article not found",
          `<h1>Article not found</h1><p>No article exists for id <code>${req.params.id}</code>.</p>`,
        ),
      );
  }

  res.type("html").send(
    pageTemplate(
      article.title,
      `
        <article class="card">
          <h1>${article.title}</h1>
          <p><strong>Author:</strong> ${getMemberName(article.author)}</p>
          <p><strong>Date:</strong> ${article.date}</p>
          <p>${article.body}</p>
        </article>
      `,
    ),
  );
});

app.get("/team", (req, res) => {
  res.type("html").send(
    pageTemplate(
      "Team",
      `
        <h1>Team directory</h1>
        <section class="grid">
          ${team
            .map(
              (member) => `
                <article class="card">
                  <h3>${member.name}</h3>
                  <p><strong>Role:</strong> ${member.role}</p>
                  <p><strong>Department:</strong> ${member.dept}</p>
                </article>
              `,
            )
            .join("")}
        </section>
      `,
    ),
  );
});

app.listen(PORT, () => {
  console.log(`TeamHub API running at http://localhost:${PORT}`);
});
