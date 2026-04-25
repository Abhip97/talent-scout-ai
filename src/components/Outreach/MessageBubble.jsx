import { motion } from 'framer-motion';

export const MessageBubble = ({ message, role, delay = 0, showTyping = false }) => {
  const isRecruiter = role === 'recruiter';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 28 }}
      className={`flex ${isRecruiter ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isRecruiter && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 mt-1">
          C
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
          isRecruiter
            ? 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm'
            : 'bg-[#1e1e2e] text-zinc-200 border border-zinc-700/50 rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
        }`}
      >
        {showTyping ? (
          <div className="flex items-center gap-1 py-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-current rounded-full opacity-60"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
              />
            ))}
          </div>
        ) : (
          message
        )}
      </div>
      {isRecruiter && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold ml-2 shrink-0 mt-1">
          R
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
