import { motion } from 'framer-motion';

const getColor = (score) => {
  if (score >= 70) return 'from-emerald-500 to-emerald-400';
  if (score >= 50) return 'from-amber-500 to-yellow-400';
  if (score >= 30) return 'from-orange-500 to-amber-400';
  return 'from-rose-600 to-rose-400';
};

const getTextColor = (score) => {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  if (score >= 30) return 'text-orange-400';
  return 'text-rose-400';
};

export const ScoreBar = ({ score = 0, label, showValue = true, height = 'h-2', delay = 0 }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-zinc-400">{label}</span>
          {showValue && <span className={`text-xs font-semibold ${getTextColor(score)}`}>{score}</span>}
        </div>
      )}
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className={`${height} rounded-full bg-gradient-to-r ${getColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
};

export const ScoreBadge = ({ score, size = 'md' }) => {
  const sizeClass = size === 'lg' ? 'text-3xl font-black' : size === 'sm' ? 'text-sm font-bold' : 'text-xl font-bold';
  return (
    <span className={`${sizeClass} ${getTextColor(score)} tabular-nums`}>{score}</span>
  );
};

export default ScoreBar;
