import "dotenv/config";
import { boolean } from "zod";

const appName = process.env.APP_NAME ?? "unnamed-app";
const logLevel = process.env.LOG_LEVEL ?? "warn";

const args = process.argv.slice(2);
const isDebug = args.includes("--debug");
const rest = args.filter((a) => a !== "--debug");

console.log("PID:      ", process.pid);
console.log("Node ver: ", process.version);
console.log("CWD:      ", process.cwd());
console.log("App name: ", appName);
console.log("Log level:", logLevel);

// Accepts one or more arguments (info hello world).
if (rest.length > 0) {
  console.log("Arguments:", rest.join(", "));
}

//Includes a --debug flag that runs with --inspect enabled.
if (isDebug || process.env.DEBUG) {
  console.log("Debug mode active — open chrome://inspect");
  debugger;
}

//Handles SIGINT by printing “Shutting down gracefully.”
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully.");
  process.exit(0);
});

console.log("\nRunning... Press Ctrl+C to exit.");
setInterval(() => {}, 1000);
