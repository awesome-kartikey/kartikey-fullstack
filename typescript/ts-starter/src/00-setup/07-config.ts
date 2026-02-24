import "dotenv/config";

const appName = process.env["APP_NAME"];
const port = process.env["PORT"];
console.log("App:", appName, "\nRunning on port:", port);
