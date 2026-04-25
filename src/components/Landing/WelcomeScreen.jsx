import { motion } from 'framer-motion';
import { ArrowRight, FileText, Search, MessageSquare, BarChart3, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { SAMPLE_JD } from '../JD/SampleJD.jsx';
import { PROVIDERS } from '../../utils/llmClient.js';

const features = [
  { icon: Search, label: 'Smart Discovery', desc: 'GitHub API, uploaded resumes, and a 75-candidate talent pool.', color: 'orange' },
  { icon: MessageSquare, label: 'AI Outreach', desc: 'Simulates realistic recruiter conversations in Auto or Co-Pilot mode.', color: 'violet' },
  { icon: BarChart3, label: 'Ranked Shortlist', desc: '5-dimension match + 4-dimension interest → explainable final rank.', color: 'emerald' },
];

const FEATURE_COLORS = {
  orange: { dark: 'border-orange-500/20 bg-orange-500/5 text-orange-400', light: 'border-orange-200 bg-orange-50 text-orange-500' },
  violet: { dark: 'border-violet-500/20 bg-violet-500/5 text-violet-400', light: 'border-violet-200 bg-violet-50 text-violet-500' },
  emerald: { dark: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400', light: 'border-emerald-200 bg-emerald-50 text-emerald-600' },
};

export const WelcomeScreen = () => {
  const { setJdText, setActiveStage, apiKey, setShowApiKeyModal, theme, provider } = useApp();
  const isDark = theme === 'dark';

  const handleSampleJD = () => { setJdText(SAMPLE_JD); setActiveStage('jd'); };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-10">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10 max-w-2xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 border ${
            isDark ? 'bg-orange-500/10 border-orange-500/20 text-orange-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600'
          }`}
        >
          <Zap size={12} className="fill-current" />
          Autonomous AI Recruiting Agent · Powered by {PROVIDERS[provider]?.name}
        </motion.div>

        <h1 className={`text-4xl sm:text-5xl font-black tracking-tight mb-4 ${
          isDark
            ? 'bg-gradient-to-br from-orange-200 via-orange-100 to-orange-300/60 bg-clip-text text-transparent'
            : 'bg-gradient-to-br from-slate-800 via-indigo-700 to-violet-700 bg-clip-text text-transparent'
        }`}>
          Your AI Talent Scout
        </h1>
        <p className={`text-lg leading-relaxed ${isDark ? 'text-orange-200/50' : 'text-slate-500'}`}>
          Paste a job description. The agent finds, scores, engages,<br className="hidden sm:block" /> and ranks the best candidates — automatically.
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 w-full max-w-3xl"
      >
        {features.map((f, i) => {
          const Icon = f.icon;
          const colors = FEATURE_COLORS[f.color][isDark ? 'dark' : 'light'];
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              className={`p-4 rounded-2xl border text-left ${
                isDark ? 'bg-[#1c0f04]/60 border-orange-500/10' : 'bg-white/80 border-slate-200 shadow-sm'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border ${colors}`}>
                <Icon size={18} />
              </div>
              <h3 className={`font-bold text-sm mb-1 ${isDark ? 'text-orange-100' : 'text-slate-800'}`}>{f.label}</h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-orange-200/40' : 'text-slate-500'}`}>{f.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* API key warning */}
      {!apiKey && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 mb-6 max-w-lg w-full border ${
            isDark ? 'bg-amber-500/8 border-amber-500/20' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <Zap size={16} className="text-amber-400 fill-amber-400 shrink-0" />
          <div className="flex-1 text-sm">
            <span className={`font-semibold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>Add a free API key</span>
            <span className={isDark ? ' text-amber-200/60' : ' text-amber-600'}> to start the agent</span>
          </div>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              isDark ? 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30' : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            Add Key
          </button>
        </motion.div>
      )}

      {/* JD input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={`w-full max-w-2xl rounded-3xl border p-5 ${
          isDark ? 'bg-[#1c0f04]/70 border-orange-500/12 glow-card' : 'bg-white border-slate-200 shadow-lg shadow-slate-200/80'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <FileText size={15} className={isDark ? 'text-orange-400/60' : 'text-slate-400'} />
          <span className={`text-sm font-semibold ${isDark ? 'text-orange-200/70' : 'text-slate-600'}`}>Paste a job description to get started</span>
        </div>
        <textarea
          className={`w-full h-32 rounded-2xl p-4 text-sm placeholder-zinc-600 focus:outline-none resize-none transition leading-relaxed border ${
            isDark
              ? 'bg-[#0d0800]/80 border-orange-500/10 text-orange-100 focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/15'
              : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100'
          }`}
          placeholder="Paste your JD here, or try the sample below..."
          onChange={(e) => setJdText(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handleSampleJD}
            className={`text-xs flex items-center gap-1.5 transition-colors ${isDark ? 'text-orange-400/60 hover:text-orange-300' : 'text-indigo-500 hover:text-indigo-700'}`}
          >
            <FileText size={11} /> Try sample: Senior Backend Engineer JD
          </button>
          <motion.button
            onClick={() => setActiveStage('jd')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all ${
              isDark
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-orange-500/25'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
            }`}
          >
            Open JD Editor <ArrowRight size={15} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
