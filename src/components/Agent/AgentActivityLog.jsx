import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const AgentActivityLog = ({ maxHeight = '380px' }) => {
  const { agentLogs, clearLogs, isRunning } = useApp();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentLogs.length]);

  if (!agentLogs.length) return null;

  return (
    <div className="bg-[#0d1117] border border-[#1e1e2e] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e2e] bg-[#0a0a0f]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-zinc-500" />
          <span className="text-xs font-semibold text-zinc-400 font-mono">Agent Activity Log</span>
          {isRunning && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="text-[10px] text-emerald-400">LIVE</span>
            </div>
          )}
        </div>
        <button
          onClick={clearLogs}
          className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Clear
        </button>
      </div>

      <div
        className="overflow-y-auto p-3 space-y-0.5 font-mono text-[11px]"
        style={{ maxHeight }}
      >
        <AnimatePresence initial={false}>
          {agentLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 py-0.5 leading-relaxed group"
            >
              <span className="text-zinc-600 shrink-0 tabular-nums">[{log.timestamp}]</span>
              <span className="shrink-0">
                {log.status === 'running' ? (
                  <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse translate-y-0.5" />
                ) : log.status === 'error' ? (
                  <span className="text-rose-500">✗</span>
                ) : (
                  <span className="text-emerald-500">✓</span>
                )}
              </span>
              <span className={`break-all flex-1 ${
                log.status === 'error' ? 'text-rose-400'
                : log.status === 'running' ? 'text-blue-300'
                : 'text-zinc-300'
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
