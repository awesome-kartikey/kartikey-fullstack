import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import DeleteModal from './DeleteModal';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function TaskList() {
  const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <AddTaskForm onAdd={addTask} />
      
      <input 
        type="text" 
        placeholder="Search tasks..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="task-list">
        {filteredTasks.length === 0 ? <p>No tasks found.</p> : null}
        
        {filteredTasks.map(task => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onToggle={toggleTask}
            onDeleteClick={setDeleteId}
          />
        ))}
      </div>

      <DeleteModal 
        isOpen={deleteId !== null} 
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteTask(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}