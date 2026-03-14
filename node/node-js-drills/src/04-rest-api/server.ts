import express from "express";
import type { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { tasksRouter } from "./routes/tasks.js";
import { v1TasksRouter } from "./routes/v1/tasks.js";
import { requestId } from "./middleware/requestId.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { createProblem } from "./lib/problem.js";
import { openApiSpec } from "./docs/openapi.js";
import { metrics } from "./lib/metrics.js";

const app = express();

app.use(requestId);
app.use(requestLogger);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/metrics", (req, res) => {
  res.json(metrics.toJSON());
});

app.get("/docs/openapi.json", (req, res) => {
  res.json(openApiSpec);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/tasks", tasksRouter);
app.use("/v1/tasks", v1TasksRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error", err.stack);
  const problem = createProblem(
    500,
    "Internal Server Error",
    "An unexpected error occurred. Please try again later.",
  );
  res.status(500).json(problem);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => console.log(`REST API listening on :${PORT}`));
