import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Clock, DollarSign, Github, Linkedin, ExternalLink, BadgeCheck } from 'lucide-react';
import { ScoreBreakdown } from '../Matching/ScoreBreakdown.jsx';
import { InterestResult } from '../Outreach/InterestResult.jsx';
import { ConversationView } from '../Outreach/ConversationView.jsx';
import { SkillTag } from '../UI/SkillTag.jsx';
import { useApp } from '../../context/AppContext.jsx';

export const CandidateReport = ({ candidate, rank }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  if (!candidate) return null;

  const medals = ['🥇', '🥈', '🥉'];
  const medal = medals[rank - 1] || `#${rank}`;
  const isGitHubSource = candidate.source === 'github';

  const score = candidate.combinedScore || candidate.totalMatch || 0;
  const scoreColor = score >= 70 ? (isDark ? '#34d399' : '#059669') : score >= 50 ? (isDark ? '#fbbf24' : '#d97706') : (isDark ? '#f87171' : '#ef4444');

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 p-5">

      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 ${
          isDark ? 'bg-gradient-to-br from-orange-400 to-orange-700' : 'bg-gradient-to-br from-indigo-500 to-violet-600'
        }`}>
          {candidate.avatarUrl
            ? <img src={candidate.avatarUrl} alt={candidate.name} className="w-full h-full rounded-2xl object-cover" />
            : (candidate.name || '?').charAt(0)
          }
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl leading-none">{medal}</span>
            <h3 className={`text-xl font-black ${isDark ? 'text-orange-50' : 'text-slate-800'}`}>{candidate.name}</h3>
            {isGitHubSource && <BadgeCheck size={16} className="text-emerald-400" title="Verified GitHub candidate" />}
          </div>
          <p className={`${isDark ? 'text-orange-200/60' : 'text-slate-500'}`}>{candidate.title} · {candidate.currentCompany}</p>
          <div className={`flex flex-wrap gap-3 mt-2 text-xs ${isDark ? 'text-orange-300/50' : 'text-slate-400'}`}>
            {candidate.location && <span className="flex items-center gap-1"><MapPin size={11} />{candidate.location}</span>}
            {candidate.yearsExperience !== undefined && <span className="flex items-center gap-1"><Briefcase size={11} />{candidate.yearsExperience} years exp</span>}
            {candidate.education && <span className="flex items-center gap-1"><GraduationCap size={11} />{candidate.education.degree}, {candidate.education.college}</span>}
            {candidate.noticePeriod && <span className="flex items-center gap-1"><Clock size={11} />{candidate.noticePeriod}</span>}
            {candidate.expectedSalaryLPA && <span className="flex items-center gap-1"><DollarSign size={11} />{candidate.expectedSalaryLPA.min}–{candidate.expectedSalaryLPA.max} LPA</span>}
          </div>

          {/* Profile links */}
          <div className="flex items-center gap-3 mt-3">
            {candidate.githubUrl && (
              <a
                href={candidate.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  isGitHubSource
                    ? isDark
                      ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : isDark
                    ? 'bg-orange-500/8 border-orange-500/15 text-orange-300/70 hover:bg-orange-500/15'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Github size={13} />
                {isGitHubSource ? candidate.githubUrl.replace('https://github.com/', '@') : 'GitHub'}
                {isGitHubSource && <BadgeCheck size={12} className="text-emerald-400" />}
                <ExternalLink size={10} className="opacity-50" />
              </a>
            )}
            {candidate.linkedinUrl?.startsWith('http') && (
              <a
                href={candidate.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-blue-500/8 border-blue-500/20 text-blue-300/70 hover:bg-blue-500/15'
                    : 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <Linkedin size={13} /> LinkedIn
                <ExternalLink size={10} className="opacity-50" />
              </a>
            )}
            {candidate.email && (
              <span className={`text-xs ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>{candidate.email}</span>
            )}
          </div>
        </div>

        {/* Score badge */}
        <div className={`text-center shrink-0 p-4 rounded-2xl border ${
          isDark ? 'bg-[#1c0f04] border-orange-500/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-4xl font-black" style={{ color: scoreColor }}>{score}</div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>Combined</div>
          <div className={`mt-2 flex gap-1 text-[10px] text-center ${isDark ? 'text-orange-300/40' : 'text-slate-400'}`}>
            <div>
              <div className={`font-bold text-sm ${isDark ? 'text-orange-200' : 'text-slate-600'}`}>{candidate.totalMatch}</div>
              <div>Match</div>
            </div>
            <div className={`w-px ${isDark ? 'bg-orange-500/10' : 'bg-slate-200'}`} />
            <div>
              <div className={`font-bold text-sm ${isDark ? 'text-orange-200' : 'text-slate-600'}`}>{candidate.interestScore || '—'}</div>
              <div>Interest</div>
            </div>
          </div>
        </div>
      </div>

      {candidate.bio && (
        <p className={`text-sm leading-relaxed rounded-2xl p-4 ${
          isDark ? 'text-orange-200/50 bg-[#1c0f04] border border-orange-500/8' : 'text-slate-500 bg-slate-50 border border-slate-100'
        }`}>{candidate.bio}</p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {(candidate.skills || []).map((s) => <SkillTag key={s} skill={s} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-orange-200/70' : 'text-slate-600'}`}>Match Analysis</h4>
          <ScoreBreakdown candidate={candidate} />
        </div>
        {candidate.interestBreakdown && (
          <div>
            <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-orange-200/70' : 'text-slate-600'}`}>Interest Analysis</h4>
            <InterestResult interest={candidate.interestBreakdown} />
          </div>
        )}
      </div>

      {candidate.conversation?.length > 0 && (
        <div>
          <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-orange-200/70' : 'text-slate-600'}`}>Conversation Transcript</h4>
          <div className={`rounded-2xl p-4 ${isDark ? 'bg-[#1c0f04] border border-orange-500/8' : 'bg-slate-50 border border-slate-100'}`}>
            <ConversationView candidate={candidate} messages={candidate.conversation} interest={null} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CandidateReport;
