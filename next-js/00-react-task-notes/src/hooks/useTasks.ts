import { useState, useEffect } from "react";
import { type Task } from "../types/task";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/tasks.json");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const json = await res.json();
      setTasks(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = async (id: string, completed: boolean) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, fetchTasks, addTask, toggleTask, deleteTask };
}
