import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';

const STAGES = [
  { state: 'PARSING_JD', label: 'Parsing JD', short: 'Parse' },
  { state: 'DISCOVERING_CANDIDATES', label: 'Discovering', short: 'Discover' },
  { state: 'MATCHING', label: 'Matching', short: 'Match' },
  { state: 'OUTREACH', label: 'Outreach', short: 'Outreach' },
  { state: 'SCORING_INTEREST', label: 'Scoring Interest', short: 'Score' },
  { state: 'COMPLETE', label: 'Complete', short: 'Done' },
];

const STATE_INDEX = Object.fromEntries(STAGES.map((s, i) => [s.state, i]));

export const AgentStatusBar = () => {
  const { agentState, isRunning, theme } = useApp();
  const isDark = theme === 'dark';

  if (agentState === 'IDLE') return null;

  const currentIdx = STATE_INDEX[agentState] ?? 0;
  const progress = agentState === 'COMPLETE' ? 100 : Math.round((currentIdx / (STAGES.length - 1)) * 100);
  const isComplete = agentState === 'COMPLETE';

  return (
    <div className={`rounded-2xl px-4 py-3 space-y-2.5 border ${
      isDark ? 'bg-[#1c0f04] border-orange-500/12' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {isRunning && !isComplete && (
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-orange-400' : 'bg-indigo-500'}`} />
          )}
          <span className={`font-semibold ${isDark ? 'text-orange-200/80' : 'text-slate-700'}`}>
            {isRunning ? `${STAGES[currentIdx]?.label}...` : isComplete ? 'Pipeline Complete ✓' : 'Paused'}
          </span>
        </div>
        <span className={`font-mono font-bold ${isDark ? 'text-orange-400' : 'text-indigo-600'}`}>{progress}%</span>
      </div>

      {/* Progress track */}
      <div className={`relative w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-orange-900/30' : 'bg-slate-100'}`}>
        <motion.div
          className={`h-full rounded-full ${isDark ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {/* Stage dots */}
      <div className="flex items-center justify-between">
        {STAGES.map((stage, i) => {
          const done = i < currentIdx || isComplete;
          const active = i === currentIdx && !isComplete;
          return (
            <div key={stage.state} className="flex flex-col items-center gap-0.5">
              <div className={`w-2 h-2 rounded-full transition-all ${
                done || isComplete
                  ? isDark ? 'bg-orange-400' : 'bg-indigo-500'
                  : active
                  ? isDark ? 'bg-orange-300 scale-125 ring-2 ring-orange-300/30' : 'bg-indigo-400 scale-125 ring-2 ring-indigo-200'
                  : isDark ? 'bg-orange-900/40' : 'bg-slate-200'
              }`} />
              <span className={`text-[9px] hidden sm:block ${
                done || active ? isDark ? 'text-orange-300/70' : 'text-indigo-500' : isDark ? 'text-orange-900/40' : 'text-slate-300'
              }`}>{stage.short}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentStatusBar;
