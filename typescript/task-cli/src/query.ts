// New functionality:
// Advanced query system
// Type-safe filtering
// Pagination support

// export type TaskQuery = {
//   completed?: boolean;
//   priority?: Priority | Priority[];
//   titleContains?: string;
//   createdAfter?: Date;
//   createdBefore?: Date;
// };

// export type SortKey = keyof Pick<Task, 'title' | 'priority' | 'createdAt'>;
// export type SortDirection = 'asc' | 'desc';

// export interface QueryResult<T> {
//   data: T[];
//   total: number;
//   page?: number;
//   hasMore?: boolean;
// }
