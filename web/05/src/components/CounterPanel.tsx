import { useRef, useState } from 'react';

export default function CounterPanel() {
    const [count, setCount] = useState(0);

    // useRef: holds a value across renders WITHOUT triggering re-renders.
    // If we used useState here, every increment would cause a re-render → infinite loop.
    const renderCount = useRef(0);
    renderCount.current += 1; // runs on every render, safe to mutate

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
            <h2>Counter Panel</h2>
            <p>Count: <strong>{count}</strong></p>
            <p style={{ color: 'gray', fontSize: '0.85rem' }}>
                Renders: {renderCount.current}
            </p>
            <button onClick={() => setCount(c => c - 1)}>−</button>
            <button onClick={() => setCount(0)} style={{ margin: '0 0.5rem' }}>Reset</button>
            <button onClick={() => setCount(c => c + 1)}>+</button>
        </div>
    );
}