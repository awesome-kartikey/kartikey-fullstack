import { useState } from 'react';

// Props type for AddBookForm
interface AddBookFormProps {
  onAddBook?: (title: string, author: string) => void;
}

export default function AddBookForm({ onAddBook }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault(); // Prevent page reload
    console.log('Adding book:', { title, author });
    // Call the onAddBook callback if provided
    if (onAddBook) {
      onAddBook(title, author);
    }
    // Reset form
    setTitle('');
    setAuthor('');
  };

  // Drill 4: Keyboard event handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setTitle('');
      setAuthor('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        className="input-field"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Book title (Press Esc to clear)"
        required
      />
      <input
        className="input-field"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Author name"
        required
      />
      <button type="submit">Add Book</button>
    </form>
  );
}