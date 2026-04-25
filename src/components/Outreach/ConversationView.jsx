import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageBubble } from './MessageBubble.jsx';
import { InterestResult } from './InterestResult.jsx';

export const ConversationView = ({ candidate, messages = [], interest, autoReveal = false }) => {
  const [visibleCount, setVisibleCount] = useState(autoReveal ? 0 : messages.length);
  const [showTyping, setShowTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!autoReveal || !messages.length) {
      setVisibleCount(messages.length);
      return;
    }
    setVisibleCount(0);
    let idx = 0;
    const reveal = () => {
      if (idx >= messages.length) return;
      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        setVisibleCount(idx + 1);
        idx++;
        if (idx < messages.length) setTimeout(reveal, 800);
      }, 1200);
    };
    const t = setTimeout(reveal, 400);
    return () => clearTimeout(t);
  }, [messages, autoReveal]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, showTyping]);

  if (!messages.length && !autoReveal) {
    return (
      <div className="flex items-center justify-center py-12 text-zinc-600 text-sm">
        No conversation yet
      </div>
    );
  }

  const nextRole = messages[visibleCount]?.role;

  return (
    <div className="space-y-4">
      <div className="space-y-1 max-h-96 overflow-y-auto px-1 py-2">
        {messages.slice(0, visibleCount).map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            message={msg.message}
            delay={0}
          />
        ))}
        {showTyping && nextRole && (
          <MessageBubble role={nextRole} message="" showTyping={true} />
        )}
        <div ref={bottomRef} />
      </div>

      {visibleCount >= messages.length && interest && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <InterestResult interest={interest} />
        </motion.div>
      )}
    </div>
  );
};

export default ConversationView;
