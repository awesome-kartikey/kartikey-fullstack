import { useState } from 'react';

export default function DetailsPanel() {
    // This state is LOST when DetailsPanel unmounts.
    // Resets to '' every time the panel is shown again.
    const [note, setNote] = useState('');

    return (
        <div style={{ border: '1px solid #88f', padding: '1rem', marginTop: '1rem' }}>
            <h2>Details Panel</h2>
            <p>Type below → hide → show → state resets (unmount)</p>
            <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Type a note..."
            />
            <p>Note: "{note}"</p>
        </div>
    );
}