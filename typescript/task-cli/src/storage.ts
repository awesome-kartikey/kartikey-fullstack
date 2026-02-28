// New functionality:

// Generic storage system
// Type-safe utility functions
// Pluggable storage backends

// export interface Storage<T> {
//   save(key: string, data: T): Promise<void>;
//   load(key: string): Promise<T | null>;
//   list(): Promise<string[]>;
// }

// export class FileStorage<T> implements Storage<T> {
//   constructor(private basePath: string);
// }

// // src/utils.ts
// export function groupBy<T, K extends keyof T>(
//   items: T[],
//   key: K
// ): Record<string, T[]>;
