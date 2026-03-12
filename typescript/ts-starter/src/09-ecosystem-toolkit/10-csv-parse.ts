import Database from "better-sqlite3";
import pino from "pino";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
const records = parse("id,name\n1,Ada\n2,Alan\n", { columns: true });
const csv = stringify(records, { header: true });

// Import users from a CSV into SQLite, log results with pino.
const log = pino();
const db = new Database(":memory:");
db.exec("CREATE TABLE users (id INTEGER, name TEXT)");

const insert = db.prepare("INSERT INTO users (id, name) VALUES (@id, @name)");

for (const record of records) {
  insert.run(record);
  log.info({ userId: (record as any).id, userName: (record as any).name }, "User inserted");
}
