import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';

const STAGES = [
  { state: 'PARSING_JD', label: 'Parsing JD' },
  { state: 'DISCOVERING_CANDIDATES', label: 'Discovering' },
  { state: 'MATCHING', label: 'Matching' },
  { state: 'OUTREACH', label: 'Outreach' },
  { state: 'SCORING_INTEREST', label: 'Scoring' },
  { state: 'COMPLETE', label: 'Complete' },
];

const STATE_INDEX = Object.fromEntries(STAGES.map((s, i) => [s.state, i]));

export const AgentStatusBar = () => {
  const { agentState, isRunning } = useApp();

  if (agentState === 'IDLE') return null;

  const currentIdx = STATE_INDEX[agentState] ?? 0;
  const progress = agentState === 'COMPLETE' ? 100 : Math.round((currentIdx / (STAGES.length - 1)) * 100);

  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl px-4 py-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-medium">
          {isRunning ? `Running: ${STAGES[currentIdx]?.label}...` : agentState === 'COMPLETE' ? 'Pipeline Complete ✓' : 'Paused'}
        </span>
        <span className="text-zinc-500">{progress}%</span>
      </div>
      <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default AgentStatusBar;
