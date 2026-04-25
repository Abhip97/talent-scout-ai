import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  'Schedule Interview': 'text-emerald-400 bg-emerald-500/10',
  'Fast-Track (High Interest)': 'text-emerald-400 bg-emerald-500/10',
  'Send Detailed Role Brief': 'text-blue-400 bg-blue-500/10',
  'Negotiate Compensation': 'text-amber-400 bg-amber-500/10',
  'Add to Talent Pipeline': 'text-zinc-400 bg-zinc-700/40',
  'Do Not Pursue': 'text-rose-400 bg-rose-500/10',
};

export const RankedShortlist = () => {
  const { shortlist, matchResults, candidates } = useApp();
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
    if (key === sortKey) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ col }) => {
    if (col !== sortKey) return <ChevronUp size={12} className="opacity-20" />;
    return sortDir === 'desc' ? <ChevronDown size={12} className="text-blue-400" /> : <ChevronUp size={12} className="text-blue-400" />;
  };

  const totalMatched = matchResults.filter((c) => c.totalMatch >= 50).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Ranked Shortlist</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Final ranking: 60% Match + 40% Interest</p>
        </div>
        <ExportButtons shortlist={shortlist} />
      </div>

      <ShortlistStats
        shortlist={shortlist}
        totalCandidates={candidates.length}
        totalMatched={totalMatched}
      />

      <div className="flex items-center gap-3 bg-[#12121a] border border-[#1e1e2e] rounded-xl p-3">
        <span className="text-xs text-zinc-500">Min Combined Score:</span>
        <input
          type="range" min={0} max={90} step={5}
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
          className="w-32 accent-blue-500"
        />
        <span className="text-xs font-mono text-zinc-300 w-6">{minScore}</span>
        <span className="text-xs text-zinc-600 ml-2">{sorted.length} shown</span>
      </div>

      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e2e] bg-zinc-900/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 w-12">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500">Candidate</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 hidden md:table-cell">Source</th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 cursor-pointer hover:text-zinc-300 select-none"
                  onClick={() => handleSort('totalMatch')}
                >
                  <span className="flex items-center justify-end gap-1">Match <SortIcon col="totalMatch" /></span>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 cursor-pointer hover:text-zinc-300 select-none"
                  onClick={() => handleSort('interestScore')}
                >
                  <span className="flex items-center justify-end gap-1">Interest <SortIcon col="interestScore" /></span>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 cursor-pointer hover:text-zinc-300 select-none"
                  onClick={() => handleSort('combinedScore')}
                >
                  <span className="flex items-center justify-end gap-1">Combined <SortIcon col="combinedScore" /></span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 hidden lg:table-cell">Top Skills</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 hidden xl:table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((candidate, idx) => {
                const rank = idx + 1;
                const medal = medals[rank - 1];
                const action = candidate.interestBreakdown?.recommendedAction || 'Send Detailed Role Brief';
                const actionStyle = ACTION_COLORS[action] || ACTION_COLORS['Add to Talent Pipeline'];

                return (
                  <motion.tr
                    key={candidate.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                    className={`border-b border-[#1e1e2e] cursor-pointer transition-colors ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-zinc-900/20'
                    } hover:bg-zinc-800/40`}
                    onClick={() => { setSelectedReport(candidate); setSelectedRank(rank); }}
                  >
                    <td className="px-4 py-3">
                      <span className="text-lg leading-none">{medal || rank}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white text-sm">{candidate.name}</div>
                      <div className="text-xs text-zinc-500 truncate max-w-[180px]">{candidate.title} · {candidate.currentCompany}</div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        candidate.source === 'github' ? 'bg-emerald-500/20 text-emerald-300'
                        : candidate.source === 'resume_upload' ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-violet-500/20 text-violet-300'
                      }`}>
                        {candidate.source === 'github' ? 'GitHub' : candidate.source === 'resume_upload' ? 'Resume' : 'Pool'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-white text-sm">{candidate.totalMatch}</span>
                        <ScoreBar score={candidate.totalMatch} height="h-1" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-bold text-white text-sm">{candidate.interestScore || '—'}</span>
                        {candidate.interestScore && <ScoreBar score={candidate.interestScore} height="h-1" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xl font-black" style={{
                        color: (candidate.combinedScore || 0) >= 70 ? '#34d399'
                          : (candidate.combinedScore || 0) >= 50 ? '#fbbf24'
                          : '#f87171'
                      }}>
                        {candidate.combinedScore || candidate.totalMatch}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {(candidate.skills || []).slice(0, 3).map((s) => <SkillTag key={s} skill={s} size="xs" />)}
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
