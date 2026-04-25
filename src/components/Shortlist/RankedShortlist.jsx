import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ShortlistStats } from './ShortlistStats.jsx';
import { ExportButtons } from './ExportButtons.jsx';
import { CandidateReport } from './CandidateReport.jsx';
import { ScoreBar } from '../UI/ScoreBar.jsx';
import { SkillTag } from '../UI/SkillTag.jsx';
import { Modal } from '../UI/Modal.jsx';
import { EmptyState } from '../UI/EmptyState.jsx';
import { useApp } from '../../context/AppContext.jsx';

const medals = ['🥇', '🥈', '🥉'];

const ACTION_COLORS = {
  dark: {
    'Schedule Interview':         'text-emerald-400 bg-emerald-500/10',
    'Fast-Track (High Interest)': 'text-emerald-400 bg-emerald-500/10',
    'Send Detailed Role Brief':   'text-blue-400 bg-blue-500/10',
    'Negotiate Compensation':     'text-amber-400 bg-amber-500/10',
    'Add to Talent Pipeline':     'text-zinc-400 bg-zinc-700/40',
    'Do Not Pursue':              'text-rose-400 bg-rose-500/10',
  },
  light: {
    'Schedule Interview':         'text-emerald-700 bg-emerald-100',
    'Fast-Track (High Interest)': 'text-emerald-700 bg-emerald-100',
    'Send Detailed Role Brief':   'text-blue-700 bg-blue-100',
    'Negotiate Compensation':     'text-amber-700 bg-amber-100',
    'Add to Talent Pipeline':     'text-slate-600 bg-slate-100',
    'Do Not Pursue':              'text-rose-700 bg-rose-100',
  },
};

export const RankedShortlist = () => {
  const { shortlist, matchResults, candidates, theme } = useApp();
  const isDark = theme === 'dark';
  const [sortKey, setSortKey] = useState('combinedScore');
  const [sortDir, setSortDir] = useState('desc');
  const [minScore, setMinScore] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);

  if (!shortlist.length) {
    return (
      <EmptyState
        icon="📊"
        title="No shortlist yet"
        description="Run the agent to generate a ranked shortlist with match and interest scores."
      />
    );
  }

  const sorted = [...shortlist]
    .filter((c) => (c.combinedScore || 0) >= minScore)
    .sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    });

  const handleSort = (key) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => {
    if (col !== sortKey) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'desc'
      ? <ChevronDown size={12} className={isDark ? 'text-blue-400' : 'text-indigo-500'} />
      : <ChevronUp size={12} className={isDark ? 'text-blue-400' : 'text-indigo-500'} />;
  };

  const actionColors = isDark ? ACTION_COLORS.dark : ACTION_COLORS.light;
  const totalMatched = matchResults.filter((c) => c.totalMatch >= 50).length;

  const card = isDark
    ? 'bg-[#12121a] border-[#1e1e2e]'
    : 'bg-white border-slate-200 shadow-sm';

  const th = isDark ? 'text-zinc-500' : 'text-slate-500';
  const tdName = isDark ? 'text-white' : 'text-slate-800';
  const tdSub = isDark ? 'text-zinc-500' : 'text-slate-400';
  const rowHover = isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-indigo-50/60';
  const rowAlt = isDark ? 'bg-zinc-900/20' : 'bg-slate-50/40';
  const headBg = isDark ? 'bg-zinc-900/50 border-[#1e1e2e]' : 'bg-slate-50 border-slate-200';
  const rowBorder = isDark ? 'border-[#1e1e2e]' : 'border-slate-100';

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Ranked Shortlist
          </h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            Final ranking: 60% Match + 40% Interest
          </p>
        </div>
        <ExportButtons shortlist={shortlist} />
      </div>

      <ShortlistStats
        shortlist={shortlist}
        totalCandidates={candidates.length}
        totalMatched={totalMatched}
      />

      {/* Min score filter */}
      <div className={`flex items-center gap-3 rounded-xl p-3 border ${card}`}>
        <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Min Score:</span>
        <input
          type="range" min={0} max={90} step={5}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className={`w-32 ${isDark ? 'accent-blue-500' : 'accent-indigo-500'}`}
        />
        <span className={`text-xs font-mono w-6 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
          {minScore}
        </span>
        <span className={`text-xs ml-2 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
          {sorted.length} shown
        </span>
      </div>

      {/* Table */}
      <div className={`rounded-2xl overflow-hidden border ${card}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${headBg}`}>
                <th className={`px-4 py-3 text-left text-xs font-semibold w-12 ${th}`}>#</th>
                <th className={`px-4 py-3 text-left text-xs font-semibold ${th}`}>Candidate</th>
                <th className={`px-4 py-3 text-left text-xs font-semibold hidden md:table-cell ${th}`}>Source</th>
                <th
                  className={`px-4 py-3 text-right text-xs font-semibold cursor-pointer select-none hover:opacity-80 ${th}`}
                  onClick={() => handleSort('totalMatch')}
                >
                  <span className="flex items-center justify-end gap-1">Match <SortIcon col="totalMatch" /></span>
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-semibold cursor-pointer select-none hover:opacity-80 ${th}`}
                  onClick={() => handleSort('interestScore')}
                >
                  <span className="flex items-center justify-end gap-1">Interest <SortIcon col="interestScore" /></span>
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-semibold cursor-pointer select-none hover:opacity-80 ${th}`}
                  onClick={() => handleSort('combinedScore')}
                >
                  <span className="flex items-center justify-end gap-1">Combined <SortIcon col="combinedScore" /></span>
                </th>
                <th className={`px-4 py-3 text-left text-xs font-semibold hidden lg:table-cell ${th}`}>Top Skills</th>
                <th className={`px-4 py-3 text-left text-xs font-semibold hidden xl:table-cell ${th}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((candidate, idx) => {
                const rank = idx + 1;
                const medal = medals[rank - 1];
                const action = candidate.interestBreakdown?.recommendedAction || 'Send Detailed Role Brief';
                const actionStyle = actionColors[action] || actionColors['Add to Talent Pipeline'];
                const score = candidate.combinedScore || candidate.totalMatch || 0;

                return (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                    className={`border-b ${rowBorder} cursor-pointer transition-colors ${
                      idx % 2 === 0 ? 'bg-transparent' : rowAlt
                    } ${rowHover}`}
                    onClick={() => { setSelectedReport(candidate); setSelectedRank(rank); }}
                  >
                    <td className="px-4 py-3">
                      <span className="text-lg leading-none">{medal || rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`font-semibold text-sm ${tdName}`}>{candidate.name}</div>
                      <div className={`text-xs truncate max-w-[180px] ${tdSub}`}>
                        {candidate.title} · {candidate.currentCompany}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        candidate.source === 'github'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : candidate.source === 'resume_upload'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-violet-500/20 text-violet-400'
                      }`}>
                        {candidate.source === 'github' ? 'GitHub'
                          : candidate.source === 'resume_upload' ? 'Resume'
                          : 'Pool'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`font-bold text-sm ${tdName}`}>{candidate.totalMatch}</span>
                        <ScoreBar score={candidate.totalMatch} height="h-1" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className={`font-bold text-sm ${tdName}`}>{candidate.interestScore || '—'}</span>
                        {candidate.interestScore && <ScoreBar score={candidate.interestScore} height="h-1" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="text-xl font-black"
                        style={{
                          color: score >= 70 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171',
                        }}
                      >
                        {score}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {(candidate.skills || []).slice(0, 3).map((s) => (
                          <SkillTag key={s} skill={s} size="xs" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${actionStyle}`}>
                        {action}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport ? `Candidate Report — #${selectedRank} ${selectedReport.name}` : ''}
        size="xl"
      >
        {selectedReport && <CandidateReport candidate={selectedReport} rank={selectedRank} />}
      </Modal>
    </div>
  );
};

export default RankedShortlist;
