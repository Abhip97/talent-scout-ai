import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, ChevronDown, Github, Linkedin, ExternalLink } from 'lucide-react';
import { SkillTag } from '../UI/SkillTag.jsx';
import { ScoreBar, ScoreBadge } from '../UI/ScoreBar.jsx';

const SOURCE_BADGE = {
  github: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  resume_upload: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  talent_pool: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};
const SOURCE_LABEL = { github: 'GitHub', resume_upload: 'Resume', talent_pool: 'Talent Pool' };

const STATUS_COLOR = {
  active: 'text-emerald-400 bg-emerald-500/10',
  passive: 'text-amber-400 bg-amber-500/10',
  'not-looking': 'text-rose-400 bg-rose-500/10',
};

export const CandidateCard = ({ candidate, parsedJD, selected, onToggleSelect, delay = 0 }) => {
  const [expanded, setExpanded] = useState(false);

  const matchedSkills = parsedJD
    ? (candidate.skills || []).filter((s) =>
        (parsedJD.requiredSkills || []).some((r) => r.toLowerCase() === s.toLowerCase())
      )
    : [];

  const scoreColor =
    candidate.totalMatch >= 70 ? 'text-emerald-400' :
    candidate.totalMatch >= 50 ? 'text-amber-400' : 'text-rose-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 24 }}
      className={`bg-[#12121a] border rounded-2xl overflow-hidden transition-all ${
        selected ? 'border-blue-500/60 ring-1 ring-blue-500/20' : 'border-[#1e1e2e] hover:border-zinc-700'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {candidate.avatarUrl ? (
            <img src={candidate.avatarUrl} alt={candidate.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-700" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {(candidate.name || '?').charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-white text-sm truncate">{candidate.name}</h3>
                <p className="text-xs text-zinc-400 truncate">{candidate.title} · {candidate.currentCompany}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {candidate.totalMatch !== undefined && (
                  <ScoreBadge score={candidate.totalMatch} size="md" />
                )}
                {onToggleSelect && (
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => onToggleSelect(candidate.id)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-500">
              {candidate.location && (
                <span className="flex items-center gap-1"><MapPin size={10} />{candidate.location}</span>
              )}
              {candidate.yearsExperience !== undefined && (
                <span className="flex items-center gap-1"><Briefcase size={10} />{candidate.yearsExperience}y exp</span>
              )}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLOR[candidate.jobSeekingStatus] || 'text-zinc-500'}`}>
                {candidate.jobSeekingStatus}
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${SOURCE_BADGE[candidate.source] || 'bg-zinc-800 text-zinc-400'}`}>
                {SOURCE_LABEL[candidate.source] || candidate.source}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {(candidate.skills || []).slice(0, 6).map((s) => (
            <SkillTag
              key={s}
              skill={s}
              matched={parsedJD ? matchedSkills.includes(s) : null}
              size="xs"
            />
          ))}
          {(candidate.skills || []).length > 6 && (
            <span className="text-[10px] text-zinc-500 px-1.5 py-0.5">+{candidate.skills.length - 6}</span>
          )}
        </div>

        {candidate.totalMatch !== undefined && (
          <div className="mt-3">
            <ScoreBar score={candidate.totalMatch} height="h-1.5" delay={delay + 0.1} />
          </div>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1 py-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors border-t border-[#1e1e2e]"
      >
        {expanded ? 'Less' : 'More details'}
        <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[#1e1e2e]"
          >
            <div className="p-4 space-y-4">
              {candidate.bio && <p className="text-xs text-zinc-400 leading-relaxed">{candidate.bio}</p>}

              {candidate.scores && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Score Breakdown</p>
                  {[
                    { label: 'Skills', val: candidate.scores.skill },
                    { label: 'Experience', val: candidate.scores.experience },
                    { label: 'Education', val: candidate.scores.education },
                    { label: 'Location', val: candidate.scores.location },
                    { label: 'Availability', val: candidate.scores.availability },
                  ].map(({ label, val }) => (
                    <ScoreBar key={label} score={val || 0} label={label} height="h-1.5" />
                  ))}
                </div>
              )}

              {candidate.explanations?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Analysis</p>
                  {candidate.explanations.map((e, i) => (
                    <p key={i} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-zinc-600 shrink-0">•</span>{e}
                    </p>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                {candidate.expectedSalaryLPA && (
                  <div className="bg-zinc-900 rounded-lg p-2">
                    <p className="text-zinc-500 text-[10px]">Expected Salary</p>
                    <p className="text-zinc-200 font-medium">{candidate.expectedSalaryLPA.min}–{candidate.expectedSalaryLPA.max} LPA</p>
                  </div>
                )}
                {candidate.noticePeriod && (
                  <div className="bg-zinc-900 rounded-lg p-2">
                    <p className="text-zinc-500 text-[10px]">Notice Period</p>
                    <p className="text-zinc-200 font-medium">{candidate.noticePeriod}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {candidate.githubUrl && (
                  <a href={candidate.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}>
                    <Github size={12} /> GitHub
                  </a>
                )}
                {candidate.linkedinUrl && candidate.linkedinUrl.startsWith('http') && (
                  <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}>
                    <Linkedin size={12} /> LinkedIn
                  </a>
                )}
                {candidate.email && (
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <ExternalLink size={11} />{candidate.email}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CandidateCard;
