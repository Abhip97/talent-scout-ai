import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useRef, useEffect } from 'react';
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
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const AgentDashboard = () => {
  const { activeStage, jdText, parsedJD, error, setError, isRunning, agentState, theme } = useApp();
  const isDark = theme === 'dark';
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStage]);

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
        <div className={`px-6 py-4 flex flex-col gap-3 sticky top-0 z-30 border-b glass ${
          isDark ? 'bg-[#0d0800]/70 border-orange-500/10' : 'bg-white/70 border-slate-200/80'
        }`}>
          <AgentControls />
          {agentState !== 'IDLE' && <AgentStatusBar />}
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mx-6 mt-4 flex items-start gap-3 rounded-2xl px-4 py-3 border ${
            isDark ? 'bg-rose-500/8 border-rose-500/20' : 'bg-rose-50 border-rose-200'
          }`}
        >
          <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
          <p className={`text-sm flex-1 ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>{error}</p>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-300 shrink-0">
            <X size={14} />
          </button>
        </motion.div>
      )}

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto">
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
                transition={{ duration: 0.18, ease: 'easeInOut' }}
              >
                {stageComponent[activeStage] || <JDInput />}
              </motion.div>
            </AnimatePresence>

            <AgentActivityLog />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
