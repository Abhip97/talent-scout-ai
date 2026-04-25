import { SlidersHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const MatchFilters = ({ filters, onChange }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

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

  const wrapper = isDark
    ? 'bg-[#12121a] border border-[#1e1e2e]'
    : 'bg-white border border-slate-200 shadow-sm';

  const label = isDark ? 'text-zinc-500' : 'text-gray-500';
  const value = isDark ? 'text-zinc-300' : 'text-gray-700';
  const select = isDark
    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 focus:border-blue-500'
    : 'bg-slate-50 border-slate-200 text-gray-700 focus:border-indigo-400';

  return (
    <div className={`flex flex-wrap items-center gap-3 rounded-xl p-3 ${wrapper}`}>
      <SlidersHorizontal size={14} className={`shrink-0 ${label}`} />

      <div className="flex items-center gap-2">
        <label className={`text-xs whitespace-nowrap ${label}`}>Min Score</label>
        <input
          type="range" min={0} max={90} step={5}
          value={filters.minScore}
          onChange={(e) => onChange({ ...filters, minScore: Number(e.target.value) })}
          className={`w-24 ${isDark ? 'accent-blue-500' : 'accent-indigo-500'}`}
        />
        <span className={`text-xs font-mono w-6 ${value}`}>{filters.minScore}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <label className={`text-xs ${label}`}>Source:</label>
        <select
          value={filters.source}
          onChange={(e) => onChange({ ...filters, source: e.target.value })}
          className={`text-xs border rounded-lg px-2 py-1 focus:outline-none ${select}`}
        >
          {sources.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-1.5">
        <label className={`text-xs ${label}`}>Status:</label>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className={`text-xs border rounded-lg px-2 py-1 focus:outline-none ${select}`}
        >
          {statuses.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>

      <button
        onClick={() => onChange({ minScore: 0, source: 'all', status: 'all' })}
        className={`text-xs ml-auto transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Reset
      </button>
    </div>
  );
};

export default MatchFilters;
