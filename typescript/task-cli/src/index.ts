#!/usr/bin/env node
import { TaskManager } from "./TaskManager.js";
import { TaskCLI } from "./cli.js";

const manager = new TaskManager();
const cli = new TaskCLI(manager);

cli.run(process.argv).catch(console.error);
