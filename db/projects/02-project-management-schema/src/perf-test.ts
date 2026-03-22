import { pool } from "./database.js";

async function comparePerformance(projectId: number) {
  console.log(`Testing performance for Project ID: ${projectId}`);

  const startNorm = performance.now();
  const res1 = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE project_id = $1",
    [projectId],
  );
  const normTime = performance.now() - startNorm;

  const startDenorm = performance.now();
  const res2 = await pool.query(
    "SELECT task_count FROM projects WHERE id = $1",
    [projectId],
  );
  const denormTime = performance.now() - startDenorm;

  console.log(
    `Normalized (Live Count): ${normTime.toFixed(3)}ms -> Result: ${res1.rows[0].count}`,
  );
  console.log(
    `Denormalized (Cached Count): ${denormTime.toFixed(3)}ms -> Result: ${res2.rows[0].task_count}`,
  );

  await pool.end();
}

comparePerformance(1);
