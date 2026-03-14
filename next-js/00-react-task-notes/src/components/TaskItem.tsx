import { type Task } from '../types/task';

interface Props {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDeleteClick: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDeleteClick }: Props) {
  return (
    <div className="task-item">
      <input 
        type="checkbox" 
        checked={task.completed} 
        onChange={(e) => onToggle(task.id, e.target.checked)} 
      />
      <span className={task.completed ? 'completed' : ''}>
        {task.title}
      </span>
      <button onClick={() => onDeleteClick(task.id)}>Delete</button>
    </div>
  );
}