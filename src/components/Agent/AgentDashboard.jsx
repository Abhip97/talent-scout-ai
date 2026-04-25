import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { WelcomeScreen } from '../Landing/WelcomeScreen.jsx';
import { JDInput } from '../JD/JDInput.jsx';
import { CandidateDiscovery } from '../Discovery/CandidateDiscovery.jsx';
import { MatchResults } from '../Matching/MatchResults.jsx';
import { OutreachPanel } from '../Outreach/OutreachPanel.jsx';
import { RankedShortlist } from '../Shortlist/RankedShortlist.jsx';
import { AgentActivityLog } from './AgentActivityLog.jsx';
import { AgentControls } from './AgentControls.jsx';
import { AgentStatusBar } from './AgentStatusBar.jsx';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const LOADING_MESSAGES = [
  'Parsing the corporate jargon...',
  'Decoding what they actually need...',
  'Scouting talent across the matrix...',
  'Teaching AI to read between the lines...',
  'Calculating culture fit probabilities...',
  'Simulating awkward recruiter small talk...',
  'Rating enthusiasm on a scale of meh to HIRED...',
  'Generating a shortlist your hiring manager won\'t hate...',
];

export const AgentDashboard = () => {
  const { activeStage, jdText, parsedJD, error, setError, isRunning, agentState } = useApp();

  const showWelcome = !jdText && !parsedJD && activeStage === 'jd' && agentState === 'IDLE';

  const stageComponent = {
    jd: <JDInput />,
    discovery: <CandidateDiscovery />,
    matching: <MatchResults />,
    outreach: <OutreachPanel />,
    shortlist: <RankedShortlist />,
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {!showWelcome && (
        <div className="px-6 py-4 border-b border-[#1e1e2e] flex flex-col gap-3 bg-[#0a0a0f]/50 backdrop-blur-sm sticky top-14 z-30">
          <AgentControls />
          {agentState !== 'IDLE' && <AgentStatusBar />}
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-6 mt-4 flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"
        >
          <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-300 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-300 shrink-0">
            <X size={15} />
          </button>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto">
        {showWelcome ? (
          <WelcomeScreen />
        ) : (
          <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {stageComponent[activeStage] || <JDInput />}
              </motion.div>
            </AnimatePresence>

            {isRunning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs text-zinc-600 py-2 italic"
              >
                {LOADING_MESSAGES[Math.floor(Date.now() / 3000) % LOADING_MESSAGES.length]}
              </motion.div>
            )}

            <AgentActivityLog />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
