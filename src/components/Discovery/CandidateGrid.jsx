import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { CandidateCard } from './CandidateCard.jsx';
import { EmptyState } from '../UI/EmptyState.jsx';
import { CardSkeleton } from '../UI/LoadingSkeleton.jsx';

export const CandidateGrid = ({ candidates, parsedJD, selected, onToggleSelect, loading, emptyMessage }) => {
  const [view, setView] = useState('grid');

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (!candidates?.length) {
    return (
      <EmptyState
        icon="👤"
        title="No candidates yet"
        description={emptyMessage || 'Candidates will appear here after discovery.'}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''}</span>
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1">
          <button onClick={() => setView('grid')} className={`p-1 rounded ${view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'} transition-colors`}>
            <LayoutGrid size={14} />
          </button>
          <button onClick={() => setView('list')} className={`p-1 rounded ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'} transition-colors`}>
            <List size={14} />
          </button>
        </div>
      </div>
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-2'}>
        {candidates.map((c, i) => (
          <CandidateCard
            key={c.id}
            candidate={c}
            parsedJD={parsedJD}
            selected={selected?.includes(c.id)}
            onToggleSelect={onToggleSelect}
            delay={Math.min(i * 0.04, 0.3)}
          />
        ))}
      </div>
    </div>
  );
};

export default CandidateGrid;
