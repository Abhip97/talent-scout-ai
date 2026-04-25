import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Clock, DollarSign } from 'lucide-react';
import { ScoreBreakdown } from '../Matching/ScoreBreakdown.jsx';
import { InterestResult } from '../Outreach/InterestResult.jsx';
import { ConversationView } from '../Outreach/ConversationView.jsx';
import { SkillTag } from '../UI/SkillTag.jsx';

export const CandidateReport = ({ candidate, rank }) => {
  if (!candidate) return null;

  const medals = ['🥇', '🥈', '🥉'];
  const medal = medals[rank - 1] || rank;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-xl shrink-0">
          {(candidate.name || '?').charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{medal}</span>
            <h3 className="text-xl font-bold text-white">{candidate.name}</h3>
          </div>
          <p className="text-zinc-400">{candidate.title} · {candidate.currentCompany}</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-zinc-500">
            {candidate.location && <span className="flex items-center gap-1"><MapPin size={11} />{candidate.location}</span>}
            {candidate.yearsExperience !== undefined && <span className="flex items-center gap-1"><Briefcase size={11} />{candidate.yearsExperience} years exp</span>}
            {candidate.education && <span className="flex items-center gap-1"><GraduationCap size={11} />{candidate.education.degree}, {candidate.education.college}</span>}
            {candidate.noticePeriod && <span className="flex items-center gap-1"><Clock size={11} />{candidate.noticePeriod}</span>}
            {candidate.expectedSalaryLPA && <span className="flex items-center gap-1"><DollarSign size={11} />{candidate.expectedSalaryLPA.min}–{candidate.expectedSalaryLPA.max} LPA</span>}
          </div>
        </div>
        <div className="text-center shrink-0">
          <div className="text-4xl font-black text-white">{candidate.combinedScore || candidate.totalMatch}</div>
          <div className="text-xs text-zinc-500">Combined</div>
        </div>
      </div>

      {candidate.bio && (
        <p className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/40 rounded-xl p-3">{candidate.bio}</p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {(candidate.skills || []).map((s) => <SkillTag key={s} skill={s} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h4 className="text-sm font-semibold text-zinc-300 mb-3">Match Analysis</h4>
          <ScoreBreakdown candidate={candidate} />
        </div>
        {candidate.interestBreakdown && (
          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3">Interest Analysis</h4>
            <InterestResult interest={candidate.interestBreakdown} />
          </div>
        )}
      </div>

      {candidate.conversation?.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-zinc-300 mb-3">Conversation Transcript</h4>
          <div className="bg-zinc-900/40 rounded-2xl p-4">
            <ConversationView candidate={candidate} messages={candidate.conversation} interest={null} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CandidateReport;
