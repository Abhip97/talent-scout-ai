import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const STAGES = [
  { id: 'jd', emoji: '📄', label: 'Job Description', key: 'parsedJD' },
  { id: 'discovery', emoji: '🔍', label: 'Candidate Discovery', key: 'candidates' },
  { id: 'matching', emoji: '⚡', label: 'Matching & Scoring', key: 'matchResults' },
  { id: 'outreach', emoji: '💬', label: 'AI Outreach', key: 'conversations' },
  { id: 'shortlist', emoji: '📊', label: 'Ranked Shortlist', key: 'shortlist' },
];

const STATE_TO_STAGE = {
  IDLE: null,
  PARSING_JD: 'jd',
  DISCOVERING_CANDIDATES: 'discovery',
  MATCHING: 'matching',
  OUTREACH: 'outreach',
  SCORING_INTEREST: 'outreach',
  COMPLETE: 'shortlist',
};

export const Sidebar = () => {
  const { activeStage, setActiveStage, agentState, parsedJD, candidates, matchResults, conversations, shortlist, agentLogs, isRunning } = useApp();

  const runningStage = STATE_TO_STAGE[agentState];

  const isComplete = (stageId) => {
    switch (stageId) {
      case 'jd': return !!parsedJD;
      case 'discovery': return candidates.length > 0;
      case 'matching': return matchResults.length > 0;
      case 'outreach': return Object.keys(conversations).length > 0;
      case 'shortlist': return shortlist.length > 0;
      default: return false;
    }
  };

  const isAccessible = (stageId, index) => {
    if (index === 0) return true;
    const prevStage = STAGES[index - 1];
    return isComplete(prevStage.id);
  };

  const recentLogs = agentLogs.slice(-5);

  return (
    <aside className="w-64 xl:w-72 border-r border-[#1e1e2e] bg-[#0a0a0f] flex flex-col h-[calc(100vh-56px)] sticky top-14 shrink-0">
      <div className="p-4 border-b border-[#1e1e2e]">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Pipeline Stages</p>
        <nav className="space-y-1">
          {STAGES.map((stage, i) => {
            const complete = isComplete(stage.id);
            const running = runningStage === stage.id && isRunning;
            const accessible = isAccessible(stage.id, i);
            const active = activeStage === stage.id;

            return (
              <motion.button
                key={stage.id}
                onClick={() => accessible && setActiveStage(stage.id)}
                whileHover={accessible ? { x: 2 } : {}}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                  active
                    ? 'bg-zinc-800 text-white'
                    : accessible
                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    : 'text-zinc-600 cursor-not-allowed'
                }`}
              >
                <span className="text-base leading-none">{stage.emoji}</span>
                <span className="flex-1 font-medium">{stage.label}</span>
                <span className="shrink-0">
                  {running ? (
                    <Loader2 size={14} className="text-blue-400 animate-spin" />
                  ) : complete ? (
                    <CheckCircle size={14} className="text-emerald-400" />
                  ) : accessible ? (
                    <Circle size={14} className="text-zinc-700" />
                  ) : (
                    <Lock size={12} className="text-zinc-700" />
                  )}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>

      {agentLogs.length > 0 && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="px-4 pt-3 pb-2 border-b border-[#1e1e2e]">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Agent Activity</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-1.5 text-[10px] leading-relaxed">
                <span className="shrink-0 mt-0.5">
                  {log.status === 'running' ? (
                    <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse mt-1" />
                  ) : log.status === 'error' ? (
                    <span className="text-rose-400">✗</span>
                  ) : (
                    <span className="text-emerald-400">✓</span>
                  )}
                </span>
                <span className={`break-all ${log.status === 'error' ? 'text-rose-400' : log.status === 'running' ? 'text-blue-300' : 'text-zinc-400'}`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isRunning && (
        <div className="p-3 border-t border-[#1e1e2e]">
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <Loader2 size={12} className="animate-spin" />
            <span>Agent running...</span>
          </div>
          <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-blue-600 to-violet-600 animate-[shimmer_1.5s_ease-in-out_infinite] bg-[length:200%_100%]" />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
