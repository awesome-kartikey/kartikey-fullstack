import { useState } from 'react';
import Layout from './components/Layout';
import Card from './components/Card';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import Counter from './components/Counter';
import SimpleForm from './components/SimpleForm';
import UserProfile from './components/UserProfile';
import './App.css';

// Book type definition
interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  isAvailable: boolean;
}

function App() {
  // Shared state for books - lifted up so both BookList and AddBookForm can access it
  const [books, setBooks] = useState<Book[]>([]);

  const handleAddBook = (title: string, author: string) => {
    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      year: new Date().getFullYear(),
      isAvailable: true,
    };
    setBooks(prevBooks => [newBook, ...prevBooks]);
  };

  return (
      <Layout>
        <div className="drills-grid">
          
          <Card title="Drills 1, 3 & 5: Book List (Props, Derived State, Effects)">
            <BookList books={books} />
          </Card>

          <Card title="Drill 4: Add Book Form (Events)">
            <AddBookForm onAddBook={handleAddBook} />
          </Card>

          <div className="split-grid">
            <Card title="Drill 3: Counter">
              <Counter />
            </Card>
            
            <Card title="Drill 3: Simple Form">
              <SimpleForm />
            </Card>
          </div>

          <Card title="Drill 2: User Profile (Props)">
            <UserProfile name="Kartikey" email="kartikey@example.com" role="Developer" />
          </Card>

        </div>
      </Layout>
  );
}

export default App;