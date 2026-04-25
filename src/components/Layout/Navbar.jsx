import { Sun, Moon, Settings, HelpCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext.jsx';

export const Navbar = () => {
  const { theme, toggleTheme, apiKey, setShowApiKeyModal, setShowAboutModal } = useApp();

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-[#1e1e2e] bg-[#0a0a0f]/90 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
          🎯
        </div>
        <div>
          <span className="font-bold text-white text-sm tracking-tight">TalentScout AI</span>
          <div className="flex items-center gap-1 -mt-0.5">
            <Zap size={9} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-zinc-500">Powered by Groq + Llama 3.3</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setShowAboutModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <HelpCircle size={14} />
          <span className="hidden sm:block">How Scoring Works</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          title="Toggle theme"
        >
          <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
        </button>

        <button
          onClick={() => setShowApiKeyModal(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            apiKey
              ? 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
              : 'text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
          }`}
        >
          <Settings size={13} />
          <span>{apiKey ? 'API Key ✓' : 'Add API Key'}</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
