import fs from "fs/promises";
import { watch } from "fs";
import path from "path";
import { Task } from "./models/task";
import { logger } from "./logger";

export class FileStorage {
  constructor(private dataPath: string) {
    this.ensureDirectoryExists();
  }

  private async ensureDirectoryExists() {
    const dir = path.dirname(this.dataPath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(this.dataPath, JSON.stringify([]), "utf-8");
    }
  }

  async saveNotes(notes: Task[]): Promise<void> {
    await fs.writeFile(this.dataPath, JSON.stringify(notes, null, 2), "utf-8");
  }

  async loadNotes(): Promise<Task[]> {
    try {
      const data = await fs.readFile(this.dataPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      logger.error(
        { err: error },
        "Failed to load notes, returning empty array",
      );
      return [];
    }
  }

  async watchChanges(callback: () => void): Promise<void> {
    watch(this.dataPath, (eventType) => {
      if (eventType === "change") callback();
    });
  }
}
