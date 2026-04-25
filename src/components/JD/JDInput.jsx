import { useState } from 'react';
import { FileText, Upload, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { TabSwitcher } from '../UI/TabSwitcher.jsx';
import { JDFileUpload } from './JDFileUpload.jsx';
import { ParsedJDView } from './ParsedJDView.jsx';
import { SAMPLE_JD } from './SampleJD.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useAgent } from '../../hooks/useAgent.js';

const TABS = [
  { id: 'paste', label: 'Paste Text', icon: <FileText size={14} /> },
  { id: 'upload', label: 'Upload File', icon: <Upload size={14} /> },
];

export const JDInput = () => {
  const { jdText, setJdText, parsedJD, apiKey, setShowApiKeyModal, isRunning, resetPipeline, sources, setSources } = useApp();
  const { run } = useAgent();
  const [tab, setTab] = useState('paste');

  const handleSampleJD = () => { setJdText(SAMPLE_JD); setTab('paste'); };

  const handleReset = () => {
    resetPipeline();
    setJdText('');
  };

  const sourceOptions = [
    { key: 'talentPool', label: '📂 Talent Pool (75)', desc: 'Built-in candidate database' },
    { key: 'github', label: '🐙 GitHub Search', desc: 'Search public GitHub profiles' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Job Description</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Provide the JD and configure sources, then run the agent</p>
        </div>
        {(jdText || parsedJD) && (
          <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-800">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5 space-y-4">
        <TabSwitcher tabs={TABS} active={tab} onChange={setTab} />

        {tab === 'paste' ? (
          <div className="space-y-2">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste your job description here...&#10;&#10;Include role title, required skills, experience, location, salary range and responsibilities."
              className="w-full h-52 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition leading-relaxed"
            />
            <button onClick={handleSampleJD} className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
              <FileText size={12} /> Try sample Senior Backend Engineer JD
            </button>
          </div>
        ) : (
          <JDFileUpload onTextExtracted={(text) => { setJdText(text); if (text) setTab('paste'); }} />
        )}
      </div>

      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5">
        <p className="text-sm font-semibold text-zinc-300 mb-3">Discovery Sources</p>
        <div className="space-y-2">
          {sourceOptions.map(({ key, label, desc }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={sources[key]}
                onChange={(e) => setSources((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
              <div>
                <span className="text-sm font-medium text-zinc-200">{label}</span>
                <span className="text-xs text-zinc-500 ml-2">{desc}</span>
              </div>
            </label>
          ))}
          <div className="text-xs text-zinc-500 mt-1">
            Resume uploads are available in the Discovery tab after starting the agent.
          </div>
        </div>
      </div>

      {!apiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-amber-400">⚡</span>
          <span className="text-sm text-zinc-400 flex-1">
            <span className="text-amber-300 font-medium">Groq API key required</span> — add it to run the agent
          </span>
          <button onClick={() => setShowApiKeyModal(true)} className="text-xs px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors font-medium">
            Add Key
          </button>
        </div>
      )}

      <motion.button
        onClick={run}
        disabled={isRunning || !jdText.trim() || !apiKey}
        whileHover={!isRunning && jdText && apiKey ? { scale: 1.01 } : {}}
        whileTap={!isRunning && jdText && apiKey ? { scale: 0.99 } : {}}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 ${
          isRunning
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            : !jdText.trim() || !apiKey
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-xl shadow-blue-500/20'
        }`}
      >
        {isRunning ? (
          <>
            <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            Agent Running...
          </>
        ) : (
          <>
            <Play size={18} className="fill-current" />
            Run Agent
          </>
        )}
      </motion.button>

      {parsedJD && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Parsed JD Preview</p>
          <ParsedJDView parsedJD={parsedJD} />
        </div>
      )}
    </div>
  );
};

export default JDInput;
