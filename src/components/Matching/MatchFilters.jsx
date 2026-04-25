import { SlidersHorizontal } from 'lucide-react';

export const MatchFilters = ({ filters, onChange }) => {
  const sources = [
    { id: 'all', label: 'All Sources' },
    { id: 'talent_pool', label: 'Talent Pool' },
    { id: 'github', label: 'GitHub' },
    { id: 'resume_upload', label: 'Resumes' },
  ];

  const statuses = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'passive', label: 'Passive' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-3">
      <SlidersHorizontal size={14} className="text-zinc-500 shrink-0" />

      <div className="flex items-center gap-2">
        <label className="text-xs text-zinc-500 whitespace-nowrap">Min Score</label>
        <input
          type="range" min={0} max={90} step={5}
          value={filters.minScore}
          onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
          className="w-24 accent-blue-500"
        />
        <span className="text-xs font-mono text-zinc-300 w-6">{filters.minScore}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <label className="text-xs text-zinc-500">Source:</label>
        <select
          value={filters.source}
          onChange={(e) => onChange({ ...filters, source: e.target.value })}
          className="text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-200 focus:outline-none focus:border-blue-500"
        >
          {sources.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <label className="text-xs text-zinc-500">Status:</label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-200 focus:outline-none focus:border-blue-500"
        >
          {statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <button
        onClick={() => onChange({ minScore: 0, source: 'all', status: 'all' })}
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto"
      >
        Reset
      </button>
    </div>
  );
};

export default MatchFilters;
