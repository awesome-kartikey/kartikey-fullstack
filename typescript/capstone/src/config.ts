import fs from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import 'dotenv/config';

const ConfigSchema = z.object({
  dbPath: z.string().default('./data/app.db'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function getConfig(): AppConfig {
  let yamlData = {};
  
  if (fs.existsSync('config.yaml')) {
    const fileStr = fs.readFileSync('config.yaml', 'utf-8');
    yamlData = parseYaml(fileStr) || {};
  }

  const result = ConfigSchema.safeParse(yamlData);
  
  if (!result.success) {
    console.error(' Configuration validation failed:');
    console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
    process.exit(1);
  }

  return result.data;
}
