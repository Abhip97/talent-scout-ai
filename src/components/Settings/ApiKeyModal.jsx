import { useState } from 'react';
import { Eye, EyeOff, Key, CheckCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../UI/Modal.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const ApiKeyModal = () => {
  const { apiKey, setApiKey, showApiKeyModal, setShowApiKeyModal } = useApp();
  const [input, setInput] = useState(apiKey || '');
  const [show, setShow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const validate = (key) => {
    if (!key) return 'API key is required';
    if (!key.startsWith('gsk_')) return 'Groq API keys start with "gsk_"';
    if (key.length < 40) return 'API key seems too short. Please check and try again.';
    return '';
  };

  const handleSave = () => {
    const err = validate(input.trim());
    if (err) { setError(err); return; }
    setApiKey(input.trim());
    setSaved(true);
    setError('');
    setTimeout(() => {
      setSaved(false);
      setShowApiKeyModal(false);
    }, 1500);
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 7)}${'*'.repeat(Math.max(0, apiKey.length - 11))}${apiKey.slice(-4)}`
    : '';

  return (
    <Modal open={showApiKeyModal} onClose={() => setShowApiKeyModal(false)} title="Groq API Key" size="sm">
      <div className="p-6 space-y-5">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-sm text-blue-300 leading-relaxed">
          TalentScout AI uses <strong>Groq's free API</strong> with the Llama 3.3 70B model for all AI features.
          Sign up for free and create an API key — no credit card needed.
        </div>

        {apiKey && (
          <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <CheckCircle size={16} />
            <span>Current key: <code className="font-mono text-xs">{maskedKey}</code></span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
            <Key size={14} /> API Key
          </label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(''); }}
              placeholder="gsk_..."
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>

        <a
          href="https://console.groq.com/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={14} />
          Get your free API key at console.groq.com →
        </a>

        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white'
          }`}
        >
          {saved ? '✓ API Key Saved!' : 'Save API Key'}
        </motion.button>

        <p className="text-xs text-zinc-500 text-center">
          Your key is stored only in your browser's localStorage and never sent to any server.
        </p>
      </div>
    </Modal>
  );
};

export default ApiKeyModal;
