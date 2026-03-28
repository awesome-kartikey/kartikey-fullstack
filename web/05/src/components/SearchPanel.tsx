import { useEffect, useRef, useState } from 'react';

type Result = { id: number; name: string };

export default function SearchPanel() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);

    const renderCount = useRef(0);
    renderCount.current += 1;

    useEffect(() => {
        // GUARD: exit early if empty — prevents request firing on initial mount
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        // DEBOUNCE: wait 300ms after last keystroke before fetching
        const timerId = setTimeout(() => {
            setLoading(true);
            fetch(`/api/search?q=${encodeURIComponent(query)}`, {
                signal: controller.signal,
            })
                .then(r => r.json())
                .then((data: Result[]) => {
                    setResults(data);
                    setLoading(false);
                })
                .catch(err => {
                    if (err.name === 'AbortError') return; // expected — not a real error
                    setLoading(false);
                });
        }, 300);

        // CLEANUP: runs before next effect execution OR on unmount
        // Cancels the debounce timer AND any in-flight fetch
        return () => {
            clearTimeout(timerId);
            controller.abort();
        };
    }, [query]); // re-runs only when query changes

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h2>Search Panel</h2>
            <p style={{ color: 'gray', fontSize: '0.85rem' }}>Renders: {renderCount.current}</p>
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type to search..."
                style={{ padding: '0.4rem', width: '250px' }}
            />
            {loading && <p>Loading...</p>}
            {!loading && results.length === 0 && query.trim() && <p>No results.</p>}
            {!loading && results.length > 0 && (
                <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
            )}
        </div>
    );
}