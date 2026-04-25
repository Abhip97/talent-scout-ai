import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';
import { AutoModeRunner } from './AutoModeRunner.jsx';
import { CoPilotMode } from './CoPilotMode.jsx';
import { EmptyState } from '../UI/EmptyState.jsx';
import { ScoreBadge } from '../UI/ScoreBar.jsx';
import { useApp } from '../../context/AppContext.jsx';

const CandidateOutreachRow = ({ candidate, parsedJD, conversation, interest, agentMode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-zinc-800/30 transition-colors text-left"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {(candidate.name || '?').charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{candidate.name}</p>
          <p className="text-xs text-zinc-400 truncate">{candidate.title} · {candidate.currentCompany}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {candidate.totalMatch !== undefined && (
            <div className="text-center">
              <div className="text-[10px] text-zinc-600 mb-0.5">Match</div>
              <ScoreBadge score={candidate.totalMatch} size="sm" />
            </div>
          )}
          {interest && (
            <div className="text-center">
              <div className="text-[10px] text-zinc-600 mb-0.5">Interest</div>
              <ScoreBadge score={interest.totalInterest} size="sm" />
            </div>
          )}
          {interest?.recommendedAction && (
            <span className="hidden md:block text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 max-w-[120px] truncate">
              {interest.recommendedAction}
            </span>
          )}
          {open ? <ChevronDown size={15} className="text-zinc-500" /> : <ChevronRight size={15} className="text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#1e1e2e] overflow-hidden"
          >
            <div className="p-4">
              {agentMode === 'copilot' && (!conversation || conversation.length === 0) ? (
                <CoPilotMode candidate={candidate} parsedJD={parsedJD} />
              ) : (
                <AutoModeRunner candidate={candidate} messages={conversation || []} interest={interest} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const OutreachPanel = () => {
  const { matchResults, parsedJD, conversations, shortlist, agentMode } = useApp();

  const outreachCandidates = shortlist.length > 0
    ? shortlist
    : matchResults.slice(0, 8);

  if (!outreachCandidates.length) {
    return (
      <EmptyState
        icon="💬"
        title="No outreach yet"
        description="Run the agent to simulate conversations with top candidates, or use Co-Pilot mode to craft messages yourself."
      />
    );
  }

  const withConversations = outreachCandidates.filter((c) => conversations[c.id]?.length > 0);
  const withoutConversations = outreachCandidates.filter((c) => !conversations[c.id]?.length);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">AI Outreach</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {withConversations.length} conversation{withConversations.length !== 1 ? 's' : ''} completed ·{' '}
            <span className={agentMode === 'copilot' ? 'text-blue-400' : 'text-emerald-400'}>
              {agentMode === 'copilot' ? 'Co-Pilot' : 'Auto'} Mode
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Users size={13} />{outreachCandidates.length} candidates
        </div>
      </div>

      <div className="space-y-3">
        {outreachCandidates.map((candidate) => {
          const msgs = conversations[candidate.id] || [];
          const interest = candidate.interestBreakdown || null;
          return (
            <CandidateOutreachRow
              key={candidate.id}
              candidate={candidate}
              parsedJD={parsedJD}
              conversation={msgs}
              interest={interest}
              agentMode={agentMode}
            />
          );
        })}
      </div>
    </div>
  );
};

export default OutreachPanel;
