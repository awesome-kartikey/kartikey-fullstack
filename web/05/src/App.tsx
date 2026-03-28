import { useState } from 'react';
import CounterPanel from './components/CounterPanel';
import SearchPanel from './components/SearchPanel';
import DetailsPanel from './components/DetailsPanel';

export default function App() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>React Execution Model Lab</h1>

      <CounterPanel />
      <hr />
      <SearchPanel />
      <hr />

      <button onClick={() => setShowDetails(prev => !prev)}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {/* Conditional render: DetailsPanel mounts/unmounts with showDetails */}
      {showDetails && <DetailsPanel />}
    </div>
  );
}