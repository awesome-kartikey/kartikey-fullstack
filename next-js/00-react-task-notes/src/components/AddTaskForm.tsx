import { useState } from 'react';

interface Props {
  onAdd: (title: string) => void;
}

export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === '') return;
    
    onAdd(title);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
      />
      <button type="submit">Add Task</button>
    </form>
  );
}