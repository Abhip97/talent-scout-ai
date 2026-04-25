import { useState } from 'react';
import { Search } from 'lucide-react';
import candidatesData from '../../data/candidates.json';
import { CandidateCard } from './CandidateCard.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const TalentPool = () => {
  const { parsedJD, matchResults } = useApp();
  const [search, setSearch] = useState('');

  const displayData = matchResults.filter((c) => c.source === 'talent_pool').length > 0
    ? matchResults.filter((c) => c.source === 'talent_pool')
    : candidatesData;

  const filtered = displayData.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    (c.skills || []).some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
    (c.currentCompany || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, title, skill, company..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <span className="text-xs text-zinc-500 shrink-0">{filtered.length} / {displayData.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.slice(0, 20).map((c, i) => (
          <CandidateCard key={c.id} candidate={c} parsedJD={parsedJD} delay={Math.min(i * 0.03, 0.25)} />
        ))}
      </div>
      {filtered.length > 20 && (
        <p className="text-center text-xs text-zinc-500 py-3">
          Showing 20 of {filtered.length} — run the agent to see all ranked results
        </p>
      )}
    </div>
  );
};

export default TalentPool;
