import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { ScoreBar } from '../UI/ScoreBar.jsx';
import { AnimatedCounter } from '../UI/AnimatedCounter.jsx';

const ACTION_STYLES = {
  'Schedule Interview': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Fast-Track (High Interest)': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Send Detailed Role Brief': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Negotiate Compensation': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Add to Talent Pipeline': 'bg-zinc-700/60 text-zinc-300 border-zinc-600/30',
  'Do Not Pursue': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const dimensionKeys = [
  { key: 'enthusiasm', label: 'Enthusiasm', max: 25 },
  { key: 'availability', label: 'Availability', max: 25 },
  { key: 'salaryAlignment', label: 'Salary Alignment', max: 25 },
  { key: 'willingnessToProceed', label: 'Willingness', max: 25 },
];

export const InterestResult = ({ interest, compact = false }) => {
  if (!interest) return null;

  const { totalInterest, breakdown, overallSummary, recommendedAction, redFlags = [], greenFlags = [] } = interest;
  const actionStyle = ACTION_STYLES[recommendedAction] || ACTION_STYLES['Add to Talent Pipeline'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-violet-400" />
          <span className="text-sm font-semibold text-white">Interest Score</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-white">
            <AnimatedCounter value={totalInterest} />
          </span>
          <span className="text-zinc-500 text-sm">/100</span>
        </div>
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${totalInterest}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>

      {!compact && breakdown && (
        <div className="space-y-2">
          {dimensionKeys.map(({ key, label, max }) => {
            const dim = breakdown[key];
            if (!dim) return null;
            const pct = Math.round((dim.score / max) * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-400">{label}</span>
                  <span className="text-xs font-medium text-zinc-300">{dim.score}/{max}</span>
                </div>
                <ScoreBar score={pct} height="h-1.5" />
                {dim.reason && <p className="text-[10px] text-zinc-600 mt-0.5">{dim.reason}</p>}
              </div>
            );
          })}
        </div>
      )}

      {overallSummary && (
        <p className="text-xs text-zinc-400 leading-relaxed border-t border-[#1e1e2e] pt-3">{overallSummary}</p>
      )}

      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${actionStyle}`}>
        {recommendedAction}
      </div>

      {!compact && (greenFlags.length > 0 || redFlags.length > 0) && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1e1e2e]">
          {greenFlags.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} /> Green Flags
              </p>
              {greenFlags.map((f, i) => <p key={i} className="text-[10px] text-emerald-400/80">{f}</p>)}
            </div>
          )}
          {redFlags.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle size={10} /> Red Flags
              </p>
              {redFlags.map((f, i) => <p key={i} className="text-[10px] text-rose-400/80">{f}</p>)}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default InterestResult;
