import { Play, RotateCcw, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useAgent } from '../../hooks/useAgent.js';
import { PROVIDERS } from '../../utils/llmClient.js';

export const AgentControls = () => {
  const { agentMode, setAgentMode, isRunning, resetPipeline, jdText, apiKey, provider, setShowApiKeyModal, theme } = useApp();
  const { run } = useAgent();
  const isDark = theme === 'dark';
  const canRun = !isRunning && !!jdText.trim() && !!apiKey;

  const baseBtn = isDark
    ? 'border border-orange-500/15 bg-[#1c0f04] text-orange-200 hover:bg-orange-500/10'
    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Mode switcher */}
      <div className={`flex items-center p-0.5 rounded-xl border ${isDark ? 'bg-[#1c0f04] border-orange-500/15' : 'bg-white border-slate-200'}`}>
        {[
          { id: 'auto', label: '🤖 Auto', desc: 'Fully autonomous' },
          { id: 'copilot', label: '🕹️ Co-Pilot', desc: 'You edit drafts' },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => !isRunning && setAgentMode(mode.id)}
            disabled={isRunning}
            title={mode.desc}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all ${
              agentMode === mode.id
                ? isDark
                  ? 'bg-orange-500/20 text-orange-100 shadow-sm'
                  : 'bg-indigo-600 text-white shadow-sm'
                : isDark
                ? 'text-orange-300/50 hover:text-orange-200'
                : 'text-slate-500 hover:text-slate-700'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Run button */}
      <motion.button
        onClick={run}
        disabled={!canRun}
        whileHover={canRun ? { scale: 1.02 } : {}}
        whileTap={canRun ? { scale: 0.97 } : {}}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
          isRunning
            ? isDark ? 'bg-orange-500/10 text-orange-300/50 cursor-not-allowed border border-orange-500/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            : canRun
            ? isDark
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:from-orange-400 hover:to-orange-500'
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500'
            : isDark ? 'bg-orange-500/5 text-orange-300/30 cursor-not-allowed border border-orange-500/10' : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'
        }`}
      >
        {isRunning ? (
          <>
            <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play size={13} className="fill-current" />
            Run Agent
          </>
        )}
      </motion.button>

      {/* Provider badge */}
      {apiKey && (
        <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border ${
          isDark ? 'bg-[#1c0f04] border-orange-500/15 text-orange-300/60' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <span>{PROVIDERS[provider]?.icon}</span>
          <span>{PROVIDERS[provider]?.name}</span>
        </div>
      )}

      {/* No API key warning */}
      {!apiKey && (
        <button
          onClick={() => setShowApiKeyModal(true)}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all ${
            isDark
              ? 'border-amber-500/20 bg-amber-500/8 text-amber-300 hover:bg-amber-500/15'
              : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          <Zap size={12} className="fill-current" />
          Add API Key to start
        </button>
      )}

      {/* Reset */}
      {!isRunning && (
        <button
          onClick={resetPipeline}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
            isDark ? 'text-orange-300/40 hover:text-orange-200 hover:bg-orange-500/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}
          title="Reset pipeline"
        >
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
};

export default AgentControls;
