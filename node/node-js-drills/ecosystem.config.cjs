module.exports = {
  apps: [
    {
      name: "production-api",
      script: "./dist/server.js",
      instances: "max",       // Spawns a worker for every CPU core
      exec_mode: "cluster",   // Enables load balancing across instances
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
