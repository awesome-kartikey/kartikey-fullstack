module.exports = {
  apps: [
    {
      name: "api-runner",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: { NODE_ENV: "production" },
    },
  ],
};
