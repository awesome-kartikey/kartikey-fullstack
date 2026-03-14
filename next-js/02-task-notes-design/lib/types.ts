export interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string | Date
}