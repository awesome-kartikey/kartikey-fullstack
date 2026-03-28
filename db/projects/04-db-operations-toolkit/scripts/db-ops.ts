import { execSync } from "child_process";
import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const DB_URL =
  process.env.DATABASE_URL ||
  "postgres://kartikey:kartikey@localhost:5432/taskapp_dev";
const match = DB_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
const [_, user, password, host, port, dbname] = match || [];

const pool = new Pool({ connectionString: DB_URL });
const command = process.argv[2];
const arg = process.argv[3];

function runShell(cmd: string) {
  try {
    execSync(cmd, {
      stdio: "inherit",
      env: { ...process.env, PGPASSWORD: password },
    });
  } catch (err) {
    if (cmd.startsWith("createdb")) {
      console.log("Note: Database likely already exists, skipping creation.");
      return;
    }
    console.error(`Shell command failed: ${cmd}`);
    process.exit(1);
  }
}

async function runOps() {
  console.log(`\nRunning DB Ops: [${command.toUpperCase()}]`);

  try {
    switch (command) {
      case "create":
        console.log(`Creating database ${dbname}...`);
        runShell(`createdb -U ${user} -h ${host} -p ${port} ${dbname}`);
        console.log("Database created.");
        break;

      case "migrate":
        console.log("Applying migrations...");
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY, 
            email TEXT UNIQUE NOT NULL, 
            role TEXT DEFAULT 'user'
          );
        `);
        console.log("Migrations applied.");
        break;

      case "seed":
        console.log("Seeding realistic test data...");
        await pool.query(`
          INSERT INTO users (email, role) VALUES 
          ('admin@company.com', 'admin'),
          ('user@company.com', 'user')
          ON CONFLICT DO NOTHING;
        `);
        console.log("Database seeded.");
        break;

      case "reset":
        console.log("Dropping and recreating public schema...");
        await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
        console.log("Schema reset. Re-running migrations and seeds...");
        runShell("pnpm run db:migrate");
        runShell("pnpm run db:seed");
        console.log("Database reset complete.");
        break;

      case "backup":
        if (!fs.existsSync("./backups")) fs.mkdirSync("./backups");
        const backupFile = `./backups/backup_${new Date().toISOString().replace(/[:.]/g, "-")}.sql`;
        console.log(`Backing up to ${backupFile}...`);
        runShell(
          `pg_dump -U ${user} -h ${host} -p ${port} -d ${dbname} -f ${backupFile}`,
        );
        console.log(`Backup saved successfully.`);

        const backupFiles = fs
          .readdirSync("./backups")
          .filter((f) => f.endsWith(".sql"))
          .sort()
          .reverse();

        if (backupFiles.length > 5) {
          backupFiles.slice(5).forEach((file) => {
            fs.unlinkSync(`./backups/${file}`);
            console.log(`Deleted old backup: ${file}`);
          });
        }
        break;

      case "restore":
        if (!arg)
          throw new Error(
            "Please provide a backup file path. Example: pnpm run db:restore ./backups/file.sql",
          );
        console.log(`Restoring from ${arg}...`);
        console.log("Wiping existing schema before restore...");
        await pool.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
        runShell(
          `psql -U ${user} -h ${host} -p ${port} -d ${dbname} -f ${arg}`,
        );
        console.log(`Database restored successfully.`);
        break;

      default:
        console.log(
          "Unknown command. Available: create, migrate, seed, reset, backup, restore.",
        );
    }
  } catch (err: any) {
    console.error("Operation Error:", err.message);
  } finally {
    await pool.end();
  }
}

runOps();
