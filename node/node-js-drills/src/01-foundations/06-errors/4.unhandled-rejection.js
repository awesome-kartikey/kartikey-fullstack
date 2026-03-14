process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
  process.exit(1);
});

Promise.reject(new Error("This promise was rejected and not handled"));

console.log("App started...");
