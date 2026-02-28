import { close } from "node:fs";
import type { Task, Priority } from "./types";
import { createTask, markCompleted, filterByStatus, sortByPriority } from "./operations";

const tasks = [
  createTask("Buy groceries", "high"),
  createTask("Do laundry", "low"),
  createTask("Study TypeScript", "high"),
  createTask("Clean room", "medium"),
];

console.log("All Tasks:", tasks);
