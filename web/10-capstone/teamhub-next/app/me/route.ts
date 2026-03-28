import { cookies } from "next/headers";
import { getProfilePayload, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getMemberName } from "@/lib/data";

export async function GET() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = sessionValue ? getProfilePayload(sessionValue) : null;

  if (!payload) {
    return new Response(
      `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unauthorized</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 2rem;">
  <h1>401 Unauthorized</h1>
  <p>No valid session found.</p>
  <p><a href="/">Return home</a></p>
</body>
</html>`,
      {
        status: 401,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      },
    );
  }

  const { user, projects } = payload;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Profile</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 2rem; background: #f7f7fb; color: #1f2937; }
    .card { background: white; border: 1px solid #d1d5db; border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
    a { color: #2563eb; text-decoration: none; }
  </style>
</head>
<body>
  <p><a href="/">⬅️ Home</a></p>
  <div class="card">
    <h1>${user.name}</h1>
    <p><strong>Role:</strong> ${user.role}</p>
    <p><strong>Department:</strong> ${user.dept}</p>
  </div>

  <div class="card">
    <h2>My projects</h2>
    ${
      projects.length === 0
        ? "<p>No project assignments.</p>"
        : `<ul>${projects
            .map(
              (project) =>
                `<li><strong>${project.name}</strong> — ${project.status} — Lead: ${getMemberName(project.lead)}</li>`,
            )
            .join("")}</ul>`
    }
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
