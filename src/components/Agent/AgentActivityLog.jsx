import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const AgentActivityLog = ({ maxHeight = '360px' }) => {
  const { agentLogs, clearLogs, isRunning, theme } = useApp();
  const isDark = theme === 'dark';
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isRunning) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentLogs.length, isRunning]);

  if (!agentLogs.length) return null;

  return (
    <div className={`rounded-2xl overflow-hidden border ${
      isDark ? 'bg-[#100800] border-orange-500/10' : 'bg-slate-900 border-slate-700'
    }`}>
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
        isDark ? 'border-orange-500/10 bg-[#0d0700]' : 'border-slate-800 bg-slate-950'
      }`}>
        <div className="flex items-center gap-2">
          <Terminal size={13} className={isDark ? 'text-orange-500/50' : 'text-slate-500'} />
          <span className="text-xs font-semibold text-slate-400 font-mono">Agent Activity Log</span>
          {isRunning && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isDark ? 'bg-orange-400' : 'bg-emerald-400'}`} />
              <span className={`text-[10px] font-bold ${isDark ? 'text-orange-400' : 'text-emerald-400'}`}>LIVE</span>
            </div>
          )}
        </div>
        <button onClick={clearLogs} className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors">
          Clear
        </button>
      </div>

      <div className="overflow-y-auto p-3 space-y-0.5 font-mono text-[11px]" style={{ maxHeight }}>
        <AnimatePresence initial={false}>
          {agentLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start gap-2 py-0.5 leading-relaxed"
            >
              <span className="text-slate-600 shrink-0 tabular-nums">[{log.timestamp}]</span>
              <span className="shrink-0">
                {log.status === 'running' ? (
                  <span className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse translate-y-0.5 ${isDark ? 'bg-orange-400' : 'bg-blue-400'}`} />
                ) : log.status === 'error' ? (
                  <span className="text-rose-500">✗</span>
                ) : (
                  <span className={isDark ? 'text-orange-500' : 'text-emerald-500'}>✓</span>
                )}
              </span>
              <span className={`break-all flex-1 ${
                log.status === 'error' ? 'text-rose-400'
                : log.status === 'running' ? isDark ? 'text-orange-300' : 'text-blue-300'
                : 'text-slate-300'
              }`}>
                {log.emoji} {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default AgentActivityLog;
