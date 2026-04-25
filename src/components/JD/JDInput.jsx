import { useState } from 'react';
import { FileText, Upload, Play, RotateCcw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TabSwitcher } from '../UI/TabSwitcher.jsx';
import { JDFileUpload } from './JDFileUpload.jsx';
import { ParsedJDView } from './ParsedJDView.jsx';
import { DragDropZone } from '../UI/DragDropZone.jsx';
import { SAMPLE_JD } from './SampleJD.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useAgent } from '../../hooks/useAgent.js';

const TABS = [
  { id: 'paste', label: 'Paste Text', icon: <FileText size={13} /> },
  { id: 'upload', label: 'Upload File', icon: <Upload size={13} /> },
];

export const JDInput = () => {
  const { jdText, setJdText, parsedJD, apiKey, setShowApiKeyModal, isRunning, resetPipeline, sources, setSources, theme } = useApp();
  const { run } = useAgent();
  const [tab, setTab] = useState('paste');
  const isDark = theme === 'dark';

  const handleReset = () => { resetPipeline(); setJdText(''); };

  const card = isDark
    ? 'bg-[#1c0f04] border-orange-500/12'
    : 'bg-white border-slate-200 shadow-sm';

  const sourceOptions = [
    { key: 'talentPool', label: '📂 Talent Pool (75)', desc: 'Built-in candidate database' },
    { key: 'github', label: '🐙 GitHub Search', desc: 'Search public GitHub profiles — real URLs' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-black ${isDark ? 'text-orange-50' : 'text-slate-800'}`}>Job Description</h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-orange-200/40' : 'text-slate-400'}`}>Provide the JD and configure sources, then run the agent</p>
        </div>
        {(jdText || parsedJD) && (
          <button onClick={handleReset} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all ${
            isDark ? 'text-orange-300/50 hover:text-orange-200 hover:bg-orange-500/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
          }`}>
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* JD editor card */}
      <div className={`rounded-2xl border p-5 space-y-4 ${card}`}>
        <TabSwitcher tabs={TABS} active={tab} onChange={setTab} />

        {tab === 'paste' ? (
          <div className="space-y-2">
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder={`Paste your job description here...\n\nInclude role title, required skills, experience, location, salary range and responsibilities.`}
              className={`w-full h-52 rounded-2xl p-4 text-sm placeholder-zinc-600 focus:outline-none resize-none transition leading-relaxed border ${
                isDark
                  ? 'bg-[#0d0800]/70 border-orange-500/10 text-orange-100 focus:border-orange-500/25 focus:ring-1 focus:ring-orange-500/10'
                  : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100'
              }`}
            />
            <button onClick={() => setJdText(SAMPLE_JD)} className={`text-xs flex items-center gap-1.5 transition-colors ${isDark ? 'text-orange-400/50 hover:text-orange-300' : 'text-indigo-500 hover:text-indigo-700'}`}>
              <FileText size={11} /> Try sample: Senior Backend Engineer JD
            </button>
          </div>
        ) : (
          <JDFileUpload onTextExtracted={(text) => { setJdText(text); if (text) setTab('paste'); }} />
        )}
      </div>

      {/* Sources card */}
      <div className={`rounded-2xl border p-5 space-y-4 ${card}`}>
        <p className={`text-sm font-bold ${isDark ? 'text-orange-200/70' : 'text-slate-700'}`}>Discovery Sources</p>

        {/* Checkboxes */}
        <div className="space-y-2.5">
          {sourceOptions.map(({ key, label, desc }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={sources[key]}
                onChange={(e) => setSources((prev) => ({ ...prev, [key]: e.target.checked }))}
                className={`w-4 h-4 rounded cursor-pointer ${isDark ? 'accent-orange-500' : 'accent-indigo-600'}`}
              />
              <div>
                <span className={`text-sm font-semibold ${isDark ? 'text-orange-100' : 'text-slate-700'}`}>{label}</span>
                <span className={`text-xs ml-2 ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>{desc}</span>
              </div>
            </label>
          ))}
        </div>

        {/* Resume upload — inline */}
        <div className={`pt-3 border-t ${isDark ? 'border-orange-500/10' : 'border-slate-100'}`}>
          <p className={`text-xs font-bold mb-2.5 flex items-center gap-1.5 ${isDark ? 'text-orange-200/60' : 'text-slate-600'}`}>
            <Upload size={12} /> Upload Resumes
            <span className={`font-normal ml-1 ${isDark ? 'text-orange-300/30' : 'text-slate-400'}`}>PDF / DOCX · optional</span>
          </p>
          <DragDropZone
            onFiles={(newFiles) => {
              const valid = newFiles.filter((f) => ['pdf', 'docx'].includes(f.name.split('.').pop().toLowerCase()));
              setSources((prev) => ({ ...prev, resumes: [...(prev.resumes || []), ...valid] }));
            }}
            accept=".pdf,.docx"
            multiple
            label="Drop resumes here or click to browse"
            sublabel="PDF and DOCX supported"
          />
          <AnimatePresence>
            {(sources.resumes || []).length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs ${isDark ? 'text-orange-300/50' : 'text-slate-500'}`}>
                    {sources.resumes.length} file{sources.resumes.length !== 1 ? 's' : ''} queued
                  </span>
                  <button
                    onClick={() => setSources((p) => ({ ...p, resumes: [] }))}
                    className={`text-xs transition-colors ${isDark ? 'text-orange-300/30 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'}`}
                  >
                    Clear all
                  </button>
                </div>
                {sources.resumes.map((f) => (
                  <div key={f.name} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl ${isDark ? 'bg-orange-500/5 border border-orange-500/10' : 'bg-slate-50 border border-slate-200'}`}>
                    <FileText size={11} className={isDark ? 'text-orange-400/60' : 'text-slate-400'} />
                    <span className={`flex-1 truncate ${isDark ? 'text-orange-100/80' : 'text-slate-700'}`}>{f.name}</span>
                    <span className={isDark ? 'text-orange-300/30' : 'text-slate-400'}>{(f.size / 1024).toFixed(0)} KB</span>
                    <button
                      onClick={() => setSources((p) => ({ ...p, resumes: p.resumes.filter((r) => r.name !== f.name) }))}
                      className={`shrink-0 ${isDark ? 'text-orange-300/30 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'}`}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* API key warning */}
      {!apiKey && (
        <div className={`rounded-2xl px-4 py-3 flex items-center gap-3 border ${
          isDark ? 'bg-amber-500/8 border-amber-500/20' : 'bg-amber-50 border-amber-200'
        }`}>
          <span className="text-amber-400 text-base">⚡</span>
          <span className={`text-sm flex-1 ${isDark ? 'text-amber-200/70' : 'text-amber-700'}`}>
            <span className="font-bold">API key required</span> — add it to run the agent
          </span>
          <button onClick={() => setShowApiKeyModal(true)} className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors ${
            isDark ? 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30' : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}>
            Add Key
          </button>
        </div>
      )}

      {/* Run button */}
      <motion.button
        onClick={run}
        disabled={isRunning || !jdText.trim() || !apiKey}
        whileHover={!isRunning && jdText && apiKey ? { scale: 1.01 } : {}}
        whileTap={!isRunning && jdText && apiKey ? { scale: 0.99 } : {}}
        className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center gap-3 ${
          isRunning
            ? isDark ? 'bg-orange-500/8 text-orange-300/40 cursor-not-allowed border border-orange-500/10' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : !jdText.trim() || !apiKey
            ? isDark ? 'bg-orange-500/5 text-orange-300/20 cursor-not-allowed border border-orange-500/8' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            : isDark
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-xl shadow-orange-500/25'
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
        }`}
      >
        {isRunning ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>Parsed JD Preview</p>
          <ParsedJDView parsedJD={parsedJD} />
        </div>
      )}
    </div>
  );
};

export default JDInput;
