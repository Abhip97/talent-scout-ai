import { useState } from 'react';
import { Send, Edit3, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageBubble } from './MessageBubble.jsx';
import { InterestResult } from './InterestResult.jsx';
import { draftInitialMessage, getCandidateResponse, draftFollowUp } from '../../utils/outreachSimulator.js';
import { scoreInterest } from '../../utils/interestScorer.js';
import { useApp } from '../../context/AppContext.jsx';

export const CoPilotMode = ({ candidate, parsedJD, onComplete }) => {
  const { apiKey, updateConversation } = useApp();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState(null);
  const [step, setStep] = useState('init');
  const [error, setError] = useState('');

  const initDraft = async () => {
    setLoading(true);
    setError('');
    try {
      const msg = await draftInitialMessage(candidate, parsedJD, apiKey);
      setDraft(msg);
      setStep('editing');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!draft.trim()) return;
    const recruiterMsg = { role: 'recruiter', message: draft.trim() };
    const newMessages = [...messages, recruiterMsg];
    setMessages(newMessages);
    setDraft('');
    setLoading(true);
    setError('');

    try {
      const response = await getCandidateResponse(candidate, recruiterMsg.message, messages, apiKey);
      const candMsg = { role: 'candidate', message: response };
      const withCandMsg = [...newMessages, candMsg];
      setMessages(withCandMsg);
      updateConversation(candidate.id, withCandMsg);

      if (withCandMsg.length >= 8) {
        const result = await scoreInterest(candidate, parsedJD, withCandMsg, apiKey);
        setInterest(result);
        onComplete?.(withCandMsg, result);
        setStep('done');
      } else {
        const followUp = await draftFollowUp(candidate, parsedJD, withCandMsg, apiKey);
        setDraft(followUp);
        setStep('editing');
      }
    } catch (e) {
      setError(e.message);
      setStep('editing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <div className="w-2 h-2 bg-blue-400 rounded-full" />
        Co-Pilot Mode — You edit, AI assists
      </div>

      <div className="max-h-72 overflow-y-auto space-y-1 px-1">
        {messages.map((m, i) => <MessageBubble key={i} role={m.role} message={m.message} />)}
      </div>

      {step === 'init' && !loading && (
        <motion.button
          onClick={initDraft}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Edit3 size={15} /> Draft Opening Message
        </motion.button>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-400 py-2">
          <Loader2 size={14} className="animate-spin" />
          {messages.length === 0 ? 'Drafting opening message...' : 'Getting candidate response...'}
        </div>
      )}

      {step === 'editing' && !loading && (
        <div className="space-y-2">
          <label className="text-xs text-zinc-500 flex items-center gap-1.5">
            <Edit3 size={11} /> Edit your message before sending
          </label>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 resize-none"
            rows={4}
          />
          <motion.button
            onClick={sendMessage}
            disabled={!draft.trim()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={14} /> Send Message
          </motion.button>
        </div>
      )}

      {error && <p className="text-xs text-rose-400">{error}</p>}
      {interest && <InterestResult interest={interest} />}
    </div>
  );
};

export default CoPilotMode;
