import express, { type Express } from "express"; 
import { Pool } from "pg";

export const app: Express = express();
app.use(express.json());

let pool: Pool;
export const setPool = (p: Pool) => {
  pool = p;
};

app.post("/users", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "INSERT INTO users (email) VALUES ($1) RETURNING *",
      [req.body.email],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ error: "Validation failed" });
  }
});
