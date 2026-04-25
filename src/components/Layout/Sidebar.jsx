import { motion } from 'framer-motion';
import { CheckCircle, Circle, Loader2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

const STAGES = [
  { id: 'jd', emoji: '📄', label: 'Job Description' },
  { id: 'discovery', emoji: '🔍', label: 'Discovery' },
  { id: 'matching', emoji: '⚡', label: 'Matching' },
  { id: 'outreach', emoji: '💬', label: 'AI Outreach' },
  { id: 'shortlist', emoji: '📊', label: 'Shortlist' },
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
  const { activeStage, setActiveStage, agentState, parsedJD, candidates, matchResults, conversations, shortlist, agentLogs, isRunning, theme } = useApp();
  const isDark = theme === 'dark';
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
    return isComplete(STAGES[index - 1].id);
  };

  const recentLogs = agentLogs.slice(-6);

  return (
    <aside className={`w-56 xl:w-64 flex flex-col h-[calc(100vh-56px)] sticky top-14 shrink-0 ${
      isDark
        ? 'bg-gradient-to-b from-orange-400 via-orange-500 to-orange-700'
        : 'bg-white border-r border-slate-100'
    }`}>

      {/* Pipeline stages */}
      <div className="p-3 flex-1 overflow-y-auto">
        <p className={`text-[10px] font-bold uppercase tracking-widest px-2 mb-2 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
          Pipeline
        </p>

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
                whileTap={accessible ? { scale: 0.98 } : {}}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all text-left font-medium ${
                  active
                    ? isDark
                      ? 'bg-black/30 text-white shadow-inner'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : accessible
                    ? isDark
                      ? 'text-white/90 hover:bg-white/15 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    : isDark
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <span className="text-base leading-none">{stage.emoji}</span>
                <span className="flex-1 text-[13px]">{stage.label}</span>
                <span className="shrink-0">
                  {running ? (
                    <Loader2 size={13} className={`${isDark ? 'text-white/70' : 'text-indigo-400'} animate-spin`} />
                  ) : complete ? (
                    <CheckCircle size={13} className={isDark ? 'text-white/80' : 'text-emerald-500'} />
                  ) : accessible ? (
                    <Circle size={13} className={isDark ? 'text-white/30' : 'text-slate-300'} />
                  ) : (
                    <Lock size={11} className={isDark ? 'text-white/20' : 'text-slate-200'} />
                  )}
                </span>
              </motion.button>
            );
          })}
        </nav>

        {/* Stats row */}
        {(candidates.length > 0 || matchResults.length > 0) && (
          <div className={`mt-4 rounded-2xl p-3 space-y-2 ${isDark ? 'bg-black/25' : 'bg-slate-50 border border-slate-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/50' : 'text-slate-400'}`}>Stats</p>
            {[
              { label: 'Discovered', value: candidates.length, show: candidates.length > 0 },
              { label: 'Scored', value: matchResults.length, show: matchResults.length > 0 },
              { label: 'Strong Matches', value: matchResults.filter(c => c.totalMatch >= 60).length, show: matchResults.length > 0 },
              { label: 'Shortlisted', value: shortlist.length, show: shortlist.length > 0 },
            ].filter(s => s.show).map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className={`text-[11px] ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{label}</span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity log */}
      {recentLogs.length > 0 && (
        <div className={`border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
          <div className={`px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Recent Activity
          </div>
          <div className="px-3 pb-3 space-y-1 max-h-32 overflow-y-auto">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-1.5 text-[10px] leading-relaxed">
                <span className="shrink-0 mt-0.5">
                  {log.status === 'running' ? (
                    <span className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse mt-1 ${isDark ? 'bg-white/80' : 'bg-indigo-400'}`} />
                  ) : log.status === 'error' ? (
                    <span className={isDark ? 'text-red-300' : 'text-red-500'}>✗</span>
                  ) : (
                    <span className={isDark ? 'text-white/60' : 'text-emerald-500'}>✓</span>
                  )}
                </span>
                <span className={`break-all leading-tight ${
                  log.status === 'error'
                    ? isDark ? 'text-red-300' : 'text-red-500'
                    : log.status === 'running'
                    ? isDark ? 'text-white/90' : 'text-indigo-600'
                    : isDark ? 'text-white/60' : 'text-slate-500'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Running indicator */}
      {isRunning && (
        <div className={`px-3 py-2.5 border-t ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-100 bg-slate-50'}`}>
          <div className={`flex items-center gap-2 text-xs font-medium mb-1.5 ${isDark ? 'text-white/70' : 'text-indigo-600'}`}>
            <Loader2 size={11} className="animate-spin" />
            <span>Agent running...</span>
          </div>
          <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <div className={`h-full rounded-full animate-shimmer bg-[length:200%_100%] ${
              isDark ? 'bg-gradient-to-r from-white/60 via-white/20 to-white/60' : 'bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400'
            }`} />
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
