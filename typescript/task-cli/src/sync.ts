// New functionality:

// Async file operations
// Remote synchronization
// Background saving

// export class TaskSyncManager {
//   constructor(
//     private storage: Storage<TaskCollection>,
//     private remote?: RemoteSync
//   );

//   async save(): Promise<void>;
//   async load(): Promise<TaskCollection>;
//   async sync(): Promise<SyncResult>;
// }

// export interface RemoteSync {
//   push(data: TaskCollection): Promise<void>;
//   pull(): Promise<TaskCollection>;
// }
