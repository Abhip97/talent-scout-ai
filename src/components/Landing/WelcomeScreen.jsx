import { motion } from 'framer-motion';
import { Zap, Search, MessageSquare, BarChart3, ArrowRight, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { SAMPLE_JD } from '../JD/SampleJD.jsx';

const features = [
  {
    icon: <Search size={22} className="text-blue-400" />,
    title: 'Smart Discovery',
    desc: 'Searches GitHub profiles, parses uploaded resumes, and scans a built-in talent pool of 75 candidates.',
    color: 'border-blue-500/20 bg-blue-500/5',
  },
  {
    icon: <MessageSquare size={22} className="text-violet-400" />,
    title: 'AI-Powered Outreach',
    desc: 'Simulates realistic recruiter-candidate conversations. Auto mode or Co-Pilot where you edit messages.',
    color: 'border-violet-500/20 bg-violet-500/5',
  },
  {
    icon: <BarChart3 size={22} className="text-emerald-400" />,
    title: 'Ranked Shortlist',
    desc: 'Combines match score (5 dimensions) + interest score (4 dimensions) into a final explainable ranking.',
    color: 'border-emerald-500/20 bg-emerald-500/5',
  },
];

export const WelcomeScreen = () => {
  const { setJdText, setActiveStage, apiKey, setShowApiKeyModal } = useApp();

  const handleSampleJD = () => {
    setJdText(SAMPLE_JD);
    setActiveStage('jd');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs text-blue-300 mb-6">
          <Zap size={12} className="fill-current" />
          Autonomous AI Recruiting Agent
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Your AI Recruiting Agent
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Paste a job description. Watch the agent find, evaluate,<br className="hidden sm:block" /> and engage the best candidates — automatically.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 w-full max-w-3xl"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className={`p-5 rounded-2xl border ${f.color} text-left`}
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {!apiKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-3 mb-8 max-w-lg w-full"
        >
          <span className="text-amber-400 text-lg">⚡</span>
          <div className="flex-1 text-sm">
            <span className="text-amber-300 font-medium">Add your free Groq API key</span>
            <span className="text-zinc-400"> to start the agent</span>
          </div>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="shrink-0 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-medium transition-colors"
          >
            Add Key
          </button>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-2xl space-y-4"
      >
        <div className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-zinc-400" />
            <span className="text-sm font-medium text-zinc-300">Paste a job description to get started</span>
          </div>
          <textarea
            className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition"
            placeholder="Paste your job description here, or try the sample below..."
            onChange={(e) => setJdText(e.target.value)}
          />
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={handleSampleJD}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <FileText size={12} /> Try sample Senior Backend Engineer JD
            </button>
            <motion.button
              onClick={() => setActiveStage('jd')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              Launch Agent <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
