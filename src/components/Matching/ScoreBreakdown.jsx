import { motion } from 'framer-motion';
import { ScoreBar } from '../UI/ScoreBar.jsx';
import { SkillTag } from '../UI/SkillTag.jsx';

const scoreWeights = [
  { key: 'skill', label: 'Skill Match', weight: '40%', color: 'text-blue-400' },
  { key: 'experience', label: 'Experience', weight: '25%', color: 'text-violet-400' },
  { key: 'education', label: 'Education', weight: '15%', color: 'text-cyan-400' },
  { key: 'location', label: 'Location', weight: '10%', color: 'text-emerald-400' },
  { key: 'availability', label: 'Availability', weight: '10%', color: 'text-amber-400' },
];

export const ScoreBreakdown = ({ candidate, parsedJD, compact = false }) => {
  if (!candidate?.scores) return null;

  const matchedSkills = (candidate.scores.skillDetails?.matchedRequired || []);
  const missingSkills = (candidate.scores.skillDetails?.missingRequired || []);
  const niceSkills = (candidate.scores.skillDetails?.matchedNice || []);

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-zinc-300">Match Score Breakdown</h4>
          <div className="text-2xl font-black text-white">{candidate.totalMatch}<span className="text-sm text-zinc-500 font-normal">/100</span></div>
        </div>
      )}

      <div className="space-y-3">
        {scoreWeights.map(({ key, label, weight, color }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium ${color}`}>{label}</span>
              <span className="text-[10px] text-zinc-600">{weight}</span>
              <span className="ml-auto text-xs font-semibold text-zinc-300">{candidate.scores[key] || 0}</span>
            </div>
            <ScoreBar score={candidate.scores[key] || 0} height="h-2" delay={i * 0.08} />
          </motion.div>
        ))}
      </div>

      {!compact && (
        <>
          {(matchedSkills.length > 0 || missingSkills.length > 0) && (
            <div className="space-y-2 pt-2 border-t border-[#1e1e2e]">
              {matchedSkills.length > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Matched skills</p>
                  <div className="flex flex-wrap gap-1">
                    {matchedSkills.map((s) => <SkillTag key={s} skill={s} matched={true} size="xs" />)}
                  </div>
                </div>
              )}
              {missingSkills.length > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Missing skills</p>
                  <div className="flex flex-wrap gap-1">
                    {missingSkills.map((s) => <SkillTag key={s} skill={s} matched={false} size="xs" />)}
                  </div>
                </div>
              )}
              {niceSkills.length > 0 && (
                <div>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Nice-to-have matched</p>
                  <div className="flex flex-wrap gap-1">
                    {niceSkills.map((s) => <SkillTag key={s} skill={s} size="xs" />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {candidate.explanations?.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#1e1e2e]">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5">Analysis</p>
              {candidate.explanations.map((e, i) => (
                <p key={i} className="text-xs text-zinc-400 flex gap-2">
                  <span className="text-zinc-600 shrink-0">•</span>{e}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScoreBreakdown;
