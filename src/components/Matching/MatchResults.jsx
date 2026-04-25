import { useState } from 'react';
import { GitCompare } from 'lucide-react';
import { motion } from 'framer-motion';
import { CandidateGrid } from '../Discovery/CandidateGrid.jsx';
import { CompareView } from './CompareView.jsx';
import { MatchFilters } from './MatchFilters.jsx';
import { TabSwitcher } from '../UI/TabSwitcher.jsx';
import { EmptyState } from '../UI/EmptyState.jsx';
import { AnimatedCounter } from '../UI/AnimatedCounter.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const MatchResults = () => {
  const { matchResults, parsedJD, theme } = useApp();
  const isDark = theme === 'dark';
  const [filters, setFilters] = useState({ minScore: 0, source: 'all', status: 'all' });
  const [tab, setTab] = useState('all');
  const [compareIds, setCompareIds] = useState([]);

  if (!matchResults.length) {
    return (
      <EmptyState
        icon="⚡"
        title="No match results yet"
        description="Run the agent to score candidates against your job description."
      />
    );
  }

  const filtered = matchResults.filter((c) => {
    if (c.totalMatch < filters.minScore) return false;
    if (filters.source !== 'all' && c.source !== filters.source) return false;
    if (filters.status !== 'all' && c.jobSeekingStatus !== filters.status) return false;
    return true;
  });

  const strong = filtered.filter((c) => c.totalMatch >= 65);
  const good = filtered.filter((c) => c.totalMatch >= 40 && c.totalMatch < 65);
  const weak = filtered.filter((c) => c.totalMatch < 40);

  const displayMap = { all: filtered, strong, good, weak };
  const displayCandidates = displayMap[tab] || filtered;

  const tabs = [
    { id: 'all', label: 'All', count: filtered.length },
    { id: 'strong', label: 'Strong (≥65)', count: strong.length },
    { id: 'good', label: 'Good (40–64)', count: good.length },
    { id: 'weak', label: 'Weak (<40)', count: weak.length },
  ];

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const compareCandidates = matchResults.filter((c) => compareIds.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Match Results</h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
            <AnimatedCounter value={matchResults.length} /> candidates scored · <AnimatedCounter value={strong.length} /> strong matches
          </p>
        </div>
        {compareIds.length > 0 && (
          <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            <GitCompare size={13} /> Comparing {compareIds.length}
          </div>
        )}
      </div>

      <MatchFilters filters={filters} onChange={setFilters} />
      <TabSwitcher tabs={tabs} active={tab} onChange={setTab} />

      {compareIds.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-2xl p-5 ${
            isDark ? 'bg-[#12121a] border-blue-500/20' : 'bg-white border-blue-200 shadow-sm'
          }`}
        >
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <GitCompare size={15} className={isDark ? 'text-blue-400' : 'text-blue-600'} /> Side-by-Side Comparison
          </h3>
          <CompareView candidates={compareCandidates} onRemove={(id) => setCompareIds((p) => p.filter((x) => x !== id))} />
        </motion.div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
            {compareIds.length > 0
              ? `${compareIds.length}/3 selected for comparison`
              : 'Select up to 3 candidates to compare'}
          </p>
          {compareIds.length > 0 && (
            <button
              onClick={() => setCompareIds([])}
              className={`text-xs transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Clear selection
            </button>
          )}
        </div>
        <CandidateGrid
          candidates={displayCandidates}
          parsedJD={parsedJD}
          selected={compareIds}
          onToggleSelect={toggleCompare}
          emptyMessage="No candidates match the current filters."
        />
      </div>
    </div>
  );
};

export default MatchResults;
