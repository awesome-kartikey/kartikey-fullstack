export interface Task {
  id: string;                           //Unique-value
  title: string;                        //Description
  completed: boolean;                   //Completed or Not(True/False)
  priority: "low" | "medium" | "high";  // How important is it, sorting
  createdAt: Date;                      // When it was created
}

export type TaskStatus = "pending" | "in-progress" | "completed";
export type Priority = Task["priority"]