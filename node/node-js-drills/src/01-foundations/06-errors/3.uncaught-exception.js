process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
  // console.error("Stack:", error.stack);
  process.exit(1);
});

setTimeout(() => {
  throw new Error("This error was not caught!");
  // try {
  //   throw new Error("This error was not caught!");
  // } catch (error) {
  //   // console.error("New Error", error.message);
  // }
}, 1000);

console.log("App started...");
