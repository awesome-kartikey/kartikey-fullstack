import type { Storage } from "./storage.js";
import type { TaskCollection } from "./collection.js";

export type SyncResult = { success: boolean; error?: string };

export interface RemoteSync {
  push(data: TaskCollection): Promise<void>;
  pull(): Promise<TaskCollection>;
}

export class TaskSyncManager {
  constructor(
    private storage: Storage<TaskCollection>,
    private remote?: RemoteSync
  ) {}

  async save(collection: TaskCollection): Promise<void> {
    await this.storage.save("local_db", collection);
  }

  async load(): Promise<TaskCollection> {
    const data = await this.storage.load("local_db");
    return data || { tasks: [], metadata: { total: 0, completed: 0, lastModified: new Date() } };
  }

  async sync(): Promise<SyncResult> {
    if (!this.remote) return { success: false, error: "No remote configured" };
    try {
      const localData = await this.load();
      await this.remote.push(localData);
      const remoteData = await this.remote.pull();
      await this.save(remoteData);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
}
