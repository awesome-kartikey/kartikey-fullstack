import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
const records = parse("id,name\n1,Ada\n2,Alan\n", { columns: true });
const csv = stringify(records, { header: true });

// Import users from a CSV into SQLite, log results with pino.
