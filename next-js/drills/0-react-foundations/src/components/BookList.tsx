import { useState, useEffect } from 'react';
import BookCard, { type BookCardProps } from './BookCard';
import LoadingSpinner from './LoadingSpinner';

// Extending the prop type to include an ID for mapping
interface Book extends BookCardProps {
  id: string;
}

// Props type for BookList
interface BookListProps {
  books?: Book[];
}

export default function BookList({ books: externalBooks }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Drill 3: Search filter state
  const[searchQuery, setSearchQuery] = useState('');

  // Track books loaded from JSON
  const [jsonBooks, setJsonBooks] = useState<Book[]>([]);
  const [jsonLoaded, setJsonLoaded] = useState(false);

  // Drill 5: Effects and API Integration - load from JSON when no external books provided
  useEffect(() => {
    // If external books are provided AND have items, use them directly (plus any JSON books)
    if (externalBooks !== undefined && externalBooks.length > 0) {
      // Merge external books with JSON books (avoiding duplicates)
      const jsonOnly = jsonBooks.filter(b => !externalBooks.some(eb => eb.id === b.id));
      setBooks([...externalBooks, ...jsonOnly]);
      setLoading(false);
      return;
    }

    // Skip if already loaded JSON
    if (jsonLoaded) {
      return;
    }

    // Otherwise, load from JSON (backward compatibility)
    const controller = new AbortController();

    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/books.json', { signal: controller.signal });
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        
        const data = await response.json();
        setJsonBooks(data);
        setJsonLoaded(true);
        // If externalBooks was passed but empty, merge with JSON books
        // Otherwise just use JSON books
        if (externalBooks !== undefined && externalBooks.length === 0) {
          setBooks([...externalBooks, ...data]);
        } else {
          setBooks(data);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message + " (Using fallback mock data)");
        }
      } finally {
        setLoading(false);
      }
    };

    loadBooks();

    // Clean up effect
    return () => {
      controller.abort();
    };
  }, [externalBooks, jsonBooks, jsonLoaded]);

  // Drill 3: Derived state for filtering (no need for a separate useEffect)
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="book-list-container">
      {error && <div className="error-message">⚠️ {error}</div>}
      
      <input 
        type="text"
        className="input-field mb-4"
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="book-list">
        {filteredBooks.map(book => (
          <BookCard 
            key={book.id} 
            title={book.title}
            author={book.author}
            year={book.year}
            isAvailable={book.isAvailable}
          />
        ))}
      </div>
    </div>
  );
}
