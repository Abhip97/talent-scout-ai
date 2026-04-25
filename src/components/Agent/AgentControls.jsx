import { Play, Square, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';
import { useAgent } from '../../hooks/useAgent.js';

export const AgentControls = () => {
  const { agentMode, setAgentMode, isRunning, resetPipeline, jdText, apiKey, setShowApiKeyModal } = useApp();
  const { run } = useAgent();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        {['auto', 'copilot'].map((mode) => (
          <button
            key={mode}
            onClick={() => !isRunning && setAgentMode(mode)}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              agentMode === mode
                ? 'bg-zinc-700 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {mode === 'auto' ? '🤖 Auto Mode' : '🕹️ Co-Pilot'}
          </button>
        ))}
      </div>

      <motion.button
        onClick={run}
        disabled={isRunning || !jdText.trim() || !apiKey}
        whileHover={!isRunning && jdText && apiKey ? { scale: 1.02 } : {}}
        whileTap={!isRunning && jdText && apiKey ? { scale: 0.98 } : {}}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
          isRunning
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : !jdText.trim() || !apiKey
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-violet-500'
        }`}
      >
        {isRunning ? (
          <><Square size={14} className="fill-current" />Running...</>
        ) : (
          <><Play size={14} className="fill-current" />Run Agent</>
        )}
      </motion.button>

      {!apiKey && (
        <button
          onClick={() => setShowApiKeyModal(true)}
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors border border-amber-500/20 px-3 py-2 rounded-xl"
        >
          ⚡ Add API Key
        </button>
      )}

      {!isRunning && (
        <button
          onClick={resetPipeline}
          className="p-2 text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors"
          title="Reset pipeline"
        >
          <RotateCcw size={15} />
        </button>
      )}
    </div>
  );
};

export default AgentControls;
