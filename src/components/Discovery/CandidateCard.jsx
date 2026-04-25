import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, ChevronDown, Github, Linkedin, ExternalLink, BadgeCheck } from 'lucide-react';
import { SkillTag } from '../UI/SkillTag.jsx';
import { ScoreBar, ScoreBadge } from '../UI/ScoreBar.jsx';
import { useApp } from '../../context/AppContext.jsx';

const STATUS_COLOR = {
  active: { dark: 'text-emerald-300 bg-emerald-500/10', light: 'text-emerald-700 bg-emerald-50 border border-emerald-200' },
  passive: { dark: 'text-amber-300 bg-amber-500/10', light: 'text-amber-700 bg-amber-50 border border-amber-200' },
  'not-looking': { dark: 'text-rose-300 bg-rose-500/10', light: 'text-rose-700 bg-rose-50 border border-rose-200' },
};

const SOURCE_STYLE = {
  github: { dark: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  resume_upload: { dark: 'bg-blue-500/15 text-blue-300 border-blue-500/25', light: 'bg-blue-50 text-blue-700 border-blue-200' },
  talent_pool: { dark: 'bg-orange-500/15 text-orange-300 border-orange-500/25', light: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
};
const SOURCE_LABEL = { github: 'GitHub', resume_upload: 'Resume', talent_pool: 'Pool' };

export const CandidateCard = ({ candidate, parsedJD, selected, onToggleSelect, delay = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const matchedSkills = parsedJD
    ? (candidate.skills || []).filter((s) =>
        (parsedJD.requiredSkills || []).some((r) => r.toLowerCase() === s.toLowerCase())
      )
    : [];

  const isGitHubSource = candidate.source === 'github';
  const statusStyle = STATUS_COLOR[candidate.jobSeekingStatus]?.[isDark ? 'dark' : 'light'] || '';
  const sourceStyle = (SOURCE_STYLE[candidate.source] || SOURCE_STYLE.talent_pool)[isDark ? 'dark' : 'light'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 24 }}
      className={`rounded-2xl overflow-hidden border transition-all glow-card ${
        selected
          ? isDark ? 'border-orange-400/40 ring-1 ring-orange-400/15' : 'border-indigo-400/60 ring-1 ring-indigo-200'
          : isDark ? 'border-orange-500/10 hover:border-orange-500/20 bg-[#1c0f04]' : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {candidate.avatarUrl ? (
            <img src={candidate.avatarUrl} alt={candidate.name} className={`w-10 h-10 rounded-full object-cover shrink-0 border ${isDark ? 'border-orange-500/15' : 'border-slate-200'}`} />
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
              isDark ? 'bg-gradient-to-br from-orange-500 to-orange-700' : 'bg-gradient-to-br from-indigo-500 to-violet-600'
            }`}>
              {(candidate.name || '?').charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className={`font-bold text-sm truncate ${isDark ? 'text-orange-50' : 'text-slate-800'}`}>{candidate.name}</h3>
                  {isGitHubSource && <BadgeCheck size={13} className="text-emerald-400 shrink-0" title="Verified GitHub profile" />}
                </div>
                <p className={`text-xs truncate ${isDark ? 'text-orange-200/50' : 'text-slate-500'}`}>{candidate.title} · {candidate.currentCompany}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {candidate.totalMatch !== undefined && <ScoreBadge score={candidate.totalMatch} size="md" />}
                {onToggleSelect && (
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={() => onToggleSelect(candidate.id)}
                    className={`w-4 h-4 cursor-pointer ${isDark ? 'accent-orange-500' : 'accent-indigo-600'}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>

            <div className={`flex items-center gap-2 mt-1.5 text-[11px] flex-wrap ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>
              {candidate.location && <span className="flex items-center gap-1"><MapPin size={10} />{candidate.location}</span>}
              {candidate.yearsExperience !== undefined && <span className="flex items-center gap-1"><Briefcase size={10} />{candidate.yearsExperience}y</span>}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${statusStyle}`}>{candidate.jobSeekingStatus}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${sourceStyle}`}>{SOURCE_LABEL[candidate.source] || candidate.source}</span>
            </div>
          </div>
        </div>

        {/* GitHub link - prominent for GitHub-sourced candidates */}
        {isGitHubSource && candidate.githubUrl && (
          <a
            href={candidate.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all w-full ${
              isDark
                ? 'bg-emerald-500/8 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/15'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Github size={13} />
            <span className="flex-1">View GitHub Profile</span>
            <span className="opacity-60 truncate max-w-[140px]">{candidate.githubUrl.replace('https://github.com/', '@')}</span>
            <ExternalLink size={11} className="opacity-50 shrink-0" />
          </a>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {(candidate.skills || []).slice(0, 6).map((s) => (
            <SkillTag key={s} skill={s} matched={parsedJD ? matchedSkills.includes(s) : null} size="xs" />
          ))}
          {(candidate.skills || []).length > 6 && (
            <span className={`text-[10px] px-1.5 py-0.5 ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>+{candidate.skills.length - 6} more</span>
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
        className={`w-full flex items-center justify-center gap-1 py-2 text-xs transition-colors border-t ${
          isDark ? 'text-orange-300/40 hover:text-orange-200 hover:bg-orange-500/5 border-orange-500/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 border-slate-100'
        }`}
      >
        {expanded ? 'Less' : 'Details'}
        <ChevronDown size={12} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`overflow-hidden border-t ${isDark ? 'border-orange-500/10' : 'border-slate-100'}`}
          >
            <div className="p-4 space-y-4">
              {candidate.bio && (
                <p className={`text-xs leading-relaxed ${isDark ? 'text-orange-200/50' : 'text-slate-500'}`}>{candidate.bio}</p>
              )}

              {candidate.scores && (
                <div className="space-y-2">
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>Score Breakdown</p>
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

              <div className="grid grid-cols-2 gap-2 text-xs">
                {candidate.expectedSalaryLPA && (
                  <div className={`rounded-xl p-2 ${isDark ? 'bg-[#0d0800]' : 'bg-slate-50 border border-slate-100'}`}>
                    <p className={`text-[10px] ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>Expected Salary</p>
                    <p className={`font-semibold ${isDark ? 'text-orange-100' : 'text-slate-700'}`}>{candidate.expectedSalaryLPA.min}–{candidate.expectedSalaryLPA.max} LPA</p>
                  </div>
                )}
                {candidate.noticePeriod && (
                  <div className={`rounded-xl p-2 ${isDark ? 'bg-[#0d0800]' : 'bg-slate-50 border border-slate-100'}`}>
                    <p className={`text-[10px] ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>Notice Period</p>
                    <p className={`font-semibold ${isDark ? 'text-orange-100' : 'text-slate-700'}`}>{candidate.noticePeriod}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {candidate.githubUrl && (
                  <a
                    href={candidate.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      isGitHubSource
                        ? isDark ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'
                        : isDark ? 'text-orange-300/60 hover:text-orange-200' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Github size={13} />
                    <span>{isGitHubSource ? candidate.githubUrl.replace('https://github.com/', '@') : 'GitHub'}</span>
                    {isGitHubSource && <BadgeCheck size={12} className="text-emerald-400" />}
                  </a>
                )}
                {candidate.linkedinUrl?.startsWith('http') && (
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isDark ? 'text-blue-300/70 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
                {candidate.email && (
                  <span className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>
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
