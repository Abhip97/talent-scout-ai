import { motion } from 'framer-motion';
import { AnimatedCounter } from '../UI/AnimatedCounter.jsx';
import { Users, Target, MessageSquare, TrendingUp, Trophy } from 'lucide-react';

export const ShortlistStats = ({ shortlist, totalCandidates, totalMatched }) => {
  if (!shortlist?.length) return null;

  const avgMatch = Math.round(shortlist.reduce((s, c) => s + (c.totalMatch || 0), 0) / shortlist.length);
  const avgInterest = Math.round(shortlist.reduce((s, c) => s + (c.interestScore || 0), 0) / shortlist.length);
  const top = shortlist[0];

  const stats = [
    { label: 'Discovered', value: totalCandidates || 0, icon: <Users size={16} />, color: 'text-violet-400 bg-violet-500/10' },
    { label: 'Matched (≥50)', value: totalMatched || 0, icon: <Target size={16} />, color: 'text-blue-400 bg-blue-500/10' },
    { label: 'Outreach Done', value: shortlist.length, icon: <MessageSquare size={16} />, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Avg Match Score', value: avgMatch, icon: <TrendingUp size={16} />, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Avg Interest Score', value: avgInterest, icon: <TrendingUp size={16} />, color: 'text-cyan-400 bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map(({ label, value, icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-3 text-center"
          >
            <div className={`inline-flex p-2 rounded-lg mb-2 ${color}`}>{icon}</div>
            <div className="text-2xl font-black text-white"><AnimatedCounter value={value} /></div>
            <div className="text-[11px] text-zinc-500 mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {top && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4"
        >
          <Trophy size={24} className="text-amber-400 shrink-0" />
          <div>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-0.5">Top Recommendation</p>
            <p className="text-white font-bold text-lg">{top.name}</p>
            <p className="text-sm text-zinc-400">{top.title} · Combined Score: <span className="text-amber-300 font-bold">{top.combinedScore}/100</span></p>
            {top.interestBreakdown?.recommendedAction && (
              <p className="text-xs text-amber-400/70 mt-1">{top.interestBreakdown.recommendedAction}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShortlistStats;
