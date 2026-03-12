import fs from "node:fs/promises";
import path from "node:path";

export interface Storage<T> {
  save(key: string, data: T): Promise<void>;
  load(key: string): Promise<T | null>;
  list(): Promise<string[]>;
}

export class FileStorage<T> implements Storage<T> {
  constructor(private basePath: string) {}

  async save(key: string, data: T): Promise<void> {
    await fs.mkdir(this.basePath, { recursive: true });
    await fs.writeFile(path.join(this.basePath, `${key}.json`), JSON.stringify(data, null, 2));
  }

  async load(key: string): Promise<T | null> {
    try {
      const content = await fs.readFile(path.join(this.basePath, `${key}.json`), "utf-8");
      return JSON.parse(content, (k, v) => {
        if (k === "createdAt" || k === "lastModified") return new Date(v);
        return v;
      });
    } catch {
      return null;
    }
  }

  async list(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.basePath);
      return files.filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""));
    } catch {
      return [];
    }
  }
}
