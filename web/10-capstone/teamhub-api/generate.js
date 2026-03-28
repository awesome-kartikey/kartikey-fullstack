import fs from "fs";
import path from "path";
import { projects, team } from "../data.js";

function getMemberName(id) {
  const member = team.find((item) => item.id === id);
  return member ? member.name : "Unknown";
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

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Projects SSG</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; background: #f7f7fb; color: #1f2937; }
    nav { margin: 1rem 0 2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
    nav a { color: #2563eb; text-decoration: none; }
    .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
    .card { background: white; border: 1px solid #d1d5db; border-radius: 12px; padding: 1rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.85rem; background: #e5e7eb; margin-left: 0.5rem; }
  </style>
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/projects">Projects</a>
    <a href="/articles">Articles</a>
    <a href="/team">Team</a>
  </nav>

  <h1>Projects (SSG)</h1>
  <p>This file was generated ahead of time from data.js.</p>

  <section class="grid">
    ${projects.map(renderProjectCard).join("")}
  </section>
</body>
</html>`;

const outputPath = path.join(
  import.meta.dirname,
  "public",
  "projects",
  "static.html",
);

fs.writeFileSync(outputPath, html, "utf8");
console.log(`Generated ${outputPath}`);
