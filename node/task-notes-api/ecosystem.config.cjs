module.exports = {
  apps: [
    {
      name: "task-notes-api",
      script: "dist/src/index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
