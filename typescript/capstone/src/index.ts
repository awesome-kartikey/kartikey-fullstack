import { Command } from 'commander';
import fs from 'node:fs';
import { parse as parseCsv } from 'csv-parse/sync';
import { z } from 'zod';
import pino from 'pino';
import { format } from 'date-fns';

import { getConfig } from './config.js';
import { setupSqlite, getLocalState, usersTable } from './db.js';

const program = new Command();
const config = getConfig();
const log = pino({ level: config.logLevel });

program
  .name('capstone')
  .description('All-in-One Utility CLI')
  .version('1.0.0');

// Commands

program
  .command('config:check')
  .description('Validate and print current configuration')
  .action(() => {
    log.info({ 
      env: process.env.APP_NAME || 'Not set', 
      config 
    }, 'Config loaded successfully');
  });

const UserRow = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email()
});

program
  .command('users:import <file>')
  .description('Import users from a CSV file')
  .action(async (filepath) => {
    if (!fs.existsSync(filepath)) {
      log.error(`File missing: ${filepath}`);
      process.exit(1);
    }

    log.debug(`Reading CSV from ${filepath}...`);
    const content = fs.readFileSync(filepath, 'utf-8');
    const records = parseCsv(content, { columns: true, skip_empty_lines: true });

    const db = setupSqlite(config.dbPath);
    let successCount = 0;

    for (const row of records) {
      const parsed = UserRow.safeParse(row);
      if (!parsed.success) {
        log.warn({ row, errors: parsed.error.issues }, 'Skipping invalid row');
        continue;
      }

      try {
        await db.insert(usersTable)
          .values(parsed.data)
          // This makes the operation idempotent (safe to re-run)
          .onConflictDoNothing({ target: usersTable.email });
        
        successCount++;
      } catch (err: any) {
        log.error({ err: err.message, user: parsed.data.email }, 'DB insert failed');
      }
    }

    // Update run summary
    const state = await getLocalState();
    await state.update((data) => {
      data.lastImportDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      data.totalProcessed += successCount;
    });

    log.info(`Import complete. Processed ${successCount} valid records.`);
  });

program
  .command('users:list')
  .description('List all users in the database')
  .action(async () => {
    const db = setupSqlite(config.dbPath);
    const allUsers = await db.select().from(usersTable);
    
    console.table(allUsers);
    log.info(`Displayed ${allUsers.length} users.`);
  });

program
  .command('users:add')
  .description('Manually add a user')
  .requiredOption('-n, --name <string>', 'User name')
  .requiredOption('-e, --email <string>', 'User email')
  .action(async (options) => {
    const payload = {
      id: Math.floor(Math.random() * 100000), // Random ID for manual insert
      name: options.name,
      email: options.email
    };

    const parsed = UserRow.safeParse(payload);
    if (!parsed.success) {
      log.error({ errors: parsed.error.format() }, 'Validation failed');
      process.exit(1);
    }

    const db = setupSqlite(config.dbPath);
    try {
      await db.insert(usersTable).values(parsed.data);
      log.info({ email: parsed.data.email }, 'User added manually');
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        log.error('Email already exists');
      } else {
        log.error({ err: err.message }, 'Failed to add user');
      }
    }
  });

program.parse();
