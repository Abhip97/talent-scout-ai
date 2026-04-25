import { Sun, Moon, Settings, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { PROVIDERS } from '../../utils/llmClient.js';
import { LogoMark } from '../UI/LogoMark.jsx';

export const Navbar = ({ onGoHome }) => {
  const { theme, toggleTheme, apiKey, provider, setProvider, setShowApiKeyModal, setShowAboutModal } = useApp();
  const isDark = theme === 'dark';
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const currentProvider = PROVIDERS[provider];

  return (
    <nav className={`sticky top-0 z-40 flex items-center justify-between px-5 h-14 glass ${
      isDark
        ? 'bg-[#0d0800]/80 border-b border-orange-500/10'
        : 'bg-white/80 border-b border-slate-200/80 shadow-sm'
    }`}>
      {/* Logo — click to go back to landing */}
      <button onClick={onGoHome} className="flex items-center gap-3 group">
        <motion.div whileHover={{ scale: 1.08 }} transition={{ type: 'spring', stiffness: 340, damping: 18 }}>
          <LogoMark size={34} isDark={isDark} animated={false} />
        </motion.div>
        <div>
          <span className={`font-black text-sm tracking-tight ${isDark ? 'text-orange-50' : 'text-slate-800'}`}>
            TalentScout AI
          </span>
          <div className="flex items-center gap-1 -mt-0.5">
            <Zap size={9} className={isDark ? 'text-orange-400 fill-orange-400' : 'text-indigo-400 fill-indigo-400'} />
            <span className={`text-[10px] ${isDark ? 'text-orange-300/60' : 'text-slate-400'}`}>Autonomous Recruiting Agent</span>
          </div>
        </div>
      </button>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Provider selector */}
        <div className="relative">
          <button
            onClick={() => setShowProviderMenu((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isDark
                ? 'bg-orange-500/10 border border-orange-500/20 text-orange-200 hover:bg-orange-500/20'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{currentProvider?.icon}</span>
            <span className="hidden sm:block">{currentProvider?.name}</span>
            <ChevronDown size={12} className={`transition-transform ${showProviderMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProviderMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border shadow-2xl z-50 overflow-hidden ${
                  isDark ? 'bg-[#1c0f04] border-orange-500/15 shadow-orange-900/40' : 'bg-white border-slate-200 shadow-slate-200'
                }`}
              >
                <div className={`px-4 py-2.5 border-b text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'border-orange-500/10 text-orange-400/60' : 'border-slate-100 text-slate-400'}`}>
                  LLM Provider
                </div>
                {Object.values(PROVIDERS).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setShowProviderMenu(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                      provider === p.id
                        ? isDark ? 'bg-orange-500/15 text-orange-100' : 'bg-indigo-50 text-indigo-700'
                        : isDark ? 'text-orange-200/80 hover:bg-orange-500/8' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg leading-none w-6 text-center">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{p.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${p.badgeStyle}`}>{p.badge}</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-orange-300/50' : 'text-slate-400'}`}>{p.description}</p>
                    </div>
                    {provider === p.id && (
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-orange-400' : 'bg-indigo-500'}`} />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {showProviderMenu && (
            <div className="fixed inset-0 z-40" onClick={() => setShowProviderMenu(false)} />
          )}
        </div>

        <button
          onClick={() => setShowAboutModal(true)}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl transition-all ${
            isDark ? 'text-orange-300/70 hover:text-orange-100 hover:bg-orange-500/10' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          How Scoring Works
        </button>

        <button
          onClick={toggleTheme}
          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
            isDark ? 'text-orange-300/70 hover:text-orange-100 hover:bg-orange-500/10' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title="Toggle theme"
        >
          <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.div>
        </button>

        <button
          onClick={() => setShowApiKeyModal(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            apiKey
              ? isDark
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : isDark
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-orange-500'
              : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
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
