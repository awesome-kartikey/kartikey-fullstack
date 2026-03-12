// Debug namespaces: Add debug() traces to two modules (app:users and app:repo). 
// Run with DEBUG=app:* to verify only those traces print, while leaving business logs to pino. Demonstrate toggling traces without code changes.
import debug from "debug";

const userLog = debug("app:users");
const dbLog = debug("app:repo");

userLog("Authenticating user John...");
dbLog("SELECT * FROM users WHERE name = 'John'");

// To see logs, run in terminal:
// DEBUG=app:* npx tsx src/10-best-practices/07-debug-namespaces.ts
