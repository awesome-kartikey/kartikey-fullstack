import { useState } from "react";

export interface BookCardProps {
  title: string;
  author: string;
  year: number;
  isAvailable?: boolean;
}

export default function BookCard({
  title,
  author,
  year,
  isAvailable = true,
}: BookCardProps) {
  // Drill 3: Use useState to toggle book availability
  const [available, setAvailable] = useState(isAvailable);

  return (
    <div className="book-card">
      <h3>{title}</h3>
      <p>
        by {author} ({year})
      </p>

      <div className="status-row">
        {available && <span className="badge">Available</span>}
        {!available && <span className="badge out-of-stock">Checked Out</span>}
      </div>

      <button onClick={() => setAvailable(!available)}>
        {available ? "Mark Unavailable" : "Mark Available"}
      </button>
    </div>
  );
}
