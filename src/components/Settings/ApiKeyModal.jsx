import { useState } from 'react';
import { Eye, EyeOff, Key, CheckCircle, ExternalLink, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../UI/Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { PROVIDERS } from '../../utils/llmClient.js';

const ProviderTab = ({ p, active, hasKey, isDark, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
      active
        ? isDark
          ? 'bg-orange-500/15 text-orange-100 border border-orange-500/30'
          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
        : isDark
        ? 'text-orange-300/60 hover:text-orange-200 hover:bg-orange-500/8'
        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
    }`}
  >
    <span className="text-base">{p.icon}</span>
    <span className="font-medium hidden sm:block">{p.name}</span>
    {hasKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
  </button>
);

export const ApiKeyModal = () => {
  const { provider, setProvider, apiKeys, setApiKeys, showApiKeyModal, setShowApiKeyModal, theme } = useApp();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState(provider);
  const [inputs, setInputs] = useState({ ...apiKeys });
  const [show, setShow] = useState({});
  const [saved, setSaved] = useState(null);
  const [errors, setErrors] = useState({});

  const currentProvider = PROVIDERS[activeTab];

  const validate = (id, key) => {
    if (!key) return '';
    const p = PROVIDERS[id];
    if (!key.startsWith(p.keyPrefix) && id !== 'google') return `Key should start with "${p.keyPrefix}"`;
    if (key.length < 20) return 'Key seems too short';
    return '';
  };

  const handleSave = (id) => {
    const key = inputs[id]?.trim() || '';
    const err = validate(id, key);
    if (err) { setErrors((e) => ({ ...e, [id]: err })); return; }
    setApiKeys((prev) => ({ ...prev, [id]: key }));
    setProvider(id);
    setSaved(id);
    setErrors((e) => ({ ...e, [id]: '' }));
    setTimeout(() => {
      setSaved(null);
      if (key) setShowApiKeyModal(false);
    }, 1500);
  };

  const handleClear = (id) => {
    setInputs((i) => ({ ...i, [id]: '' }));
    setApiKeys((prev) => ({ ...prev, [id]: '' }));
  };

  const cardClass = isDark
    ? 'bg-[#1c0f04] border border-orange-500/12 rounded-2xl'
    : 'bg-slate-50 border border-slate-200 rounded-2xl';

  return (
    <Modal open={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} title="API Configuration" size="md">
      <div className="p-6 space-y-5">
        {/* Provider tabs */}
        <div className="flex gap-1 flex-wrap">
          {Object.values(PROVIDERS).map((p) => (
            <ProviderTab
              key={p.id}
              p={p}
              active={activeTab === p.id}
              hasKey={!!(apiKeys[p.id]?.trim())}
              isDark={isDark}
              onClick={() => setActiveTab(p.id)}
            />
          ))}
        </div>

        {/* Selected provider form */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className={`${cardClass} p-4 space-y-4`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{currentProvider.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${isDark ? 'text-orange-50' : 'text-slate-800'}`}>{currentProvider.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${currentProvider.badgeStyle}`}>{currentProvider.badge}</span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-orange-300/50' : 'text-slate-400'}`}>{currentProvider.description}</p>
            </div>
          </div>

          {apiKeys[activeTab] && (
            <div className={`flex items-center gap-2 text-xs py-2 px-3 rounded-xl ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}>
              <CheckCircle size={14} />
              <span>Key saved: {apiKeys[activeTab].slice(0, 8)}{'*'.repeat(Math.max(0, apiKeys[activeTab].length - 12))}{apiKeys[activeTab].slice(-4)}</span>
              <button onClick={() => handleClear(activeTab)} className="ml-auto text-rose-400 hover:text-rose-300 text-[10px]">Clear</button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-orange-200/70' : 'text-slate-600'}`}>
              <Key size={13} /> API Key
            </label>
            <div className="relative">
              <input
                type={show[activeTab] ? 'text' : 'password'}
                value={inputs[activeTab] || ''}
                onChange={(e) => { setInputs((i) => ({ ...i, [activeTab]: e.target.value })); setErrors((e2) => ({ ...e2, [activeTab]: '' })); }}
                placeholder={currentProvider.placeholder}
                className={`w-full rounded-xl px-4 py-3 pr-12 text-sm font-mono placeholder-zinc-600 focus:outline-none transition ${
                  isDark
                    ? 'bg-[#0d0800] border border-orange-500/15 text-orange-100 focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20'
                    : 'bg-white border border-slate-200 text-slate-800 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200'
                }`}
                onKeyDown={(e) => e.key === 'Enter' && handleSave(activeTab)}
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, [activeTab]: !s[activeTab] }))}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-orange-300/40 hover:text-orange-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {show[activeTab] ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors[activeTab] && <p className="text-xs text-rose-400">{errors[activeTab]}</p>}
          </div>

          <a
            href={currentProvider.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 text-xs transition-colors ${isDark ? 'text-orange-400/70 hover:text-orange-300' : 'text-indigo-500 hover:text-indigo-700'}`}
          >
            <ExternalLink size={12} />
            Get your API key at {currentProvider.docsUrl.replace('https://', '').split('/')[0]}
            <ChevronRight size={11} />
          </a>

          <motion.button
            onClick={() => handleSave(activeTab)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
              saved === activeTab
                ? 'bg-emerald-500 text-white'
                : isDark
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            }`}
          >
            {saved === activeTab ? '✓ Saved & Active!' : `Save ${currentProvider.name} Key`}
          </motion.button>
        </motion.div>

        {/* All providers status */}
        <div className="grid grid-cols-4 gap-2">
          {Object.values(PROVIDERS).map((p) => {
            const hasKey = !!(apiKeys[p.id]?.trim());
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all border ${
                  hasKey
                    ? isDark ? 'border-emerald-500/25 bg-emerald-500/8' : 'border-emerald-200 bg-emerald-50'
                    : isDark ? 'border-orange-500/10 bg-transparent' : 'border-slate-100 bg-transparent'
                }`}
              >
                <span className="text-lg">{p.icon}</span>
                <span className={`text-[10px] font-medium ${isDark ? 'text-orange-300/60' : 'text-slate-500'}`}>{p.name}</span>
                <span className={`text-[10px] ${hasKey ? 'text-emerald-400' : isDark ? 'text-orange-500/30' : 'text-slate-300'}`}>
                  {hasKey ? '● Set' : '○ Empty'}
                </span>
              </button>
            );
          })}
        </div>

        <p className={`text-xs text-center ${isDark ? 'text-orange-300/30' : 'text-slate-400'}`}>
          Keys stored only in your browser's localStorage — never sent to any server.
        </p>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;
