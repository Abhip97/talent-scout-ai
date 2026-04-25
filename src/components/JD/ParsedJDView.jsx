import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Briefcase, GraduationCap } from 'lucide-react';
import { SkillTag } from '../UI/SkillTag.jsx';

export const ParsedJDView = ({ parsedJD }) => {
  if (!parsedJD) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#12121a] border border-[#1e1e2e] rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-[#1e1e2e] bg-gradient-to-r from-blue-500/5 to-violet-500/5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-lg">{parsedJD.title}</h3>
            {parsedJD.company && <p className="text-sm text-zinc-400">{parsedJD.company}{parsedJD.department ? ` · ${parsedJD.department}` : ''}</p>}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            parsedJD.workMode === 'remote' ? 'bg-emerald-500/20 text-emerald-400'
            : parsedJD.workMode === 'hybrid' ? 'bg-blue-500/20 text-blue-400'
            : 'bg-amber-500/20 text-amber-400'
          }`}>
            {parsedJD.workMode}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mt-3 text-xs text-zinc-400">
          {parsedJD.location && (
            <span className="flex items-center gap-1"><MapPin size={12} />{parsedJD.location}</span>
          )}
          {(parsedJD.minExperience !== undefined) && (
            <span className="flex items-center gap-1"><Briefcase size={12} />{parsedJD.minExperience}-{parsedJD.maxExperience} years</span>
          )}
          {parsedJD.salaryRange?.min > 0 && (
            <span className="flex items-center gap-1"><DollarSign size={12} />{parsedJD.salaryRange.min}-{parsedJD.salaryRange.max} {parsedJD.salaryRange.currency}</span>
          )}
          {parsedJD.educationRequired && (
            <span className="flex items-center gap-1"><GraduationCap size={12} />{parsedJD.educationRequired}</span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {parsedJD.requiredSkills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {parsedJD.requiredSkills.map((s) => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        )}
        {parsedJD.niceToHaveSkills?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Nice to Have</p>
            <div className="flex flex-wrap gap-1.5">
              {parsedJD.niceToHaveSkills.map((s) => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        )}
        {parsedJD.responsibilities?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Responsibilities</p>
            <ul className="space-y-1">
              {parsedJD.responsibilities.slice(0, 5).map((r, i) => (
                <li key={i} className="text-xs text-zinc-400 flex gap-2">
                  <span className="text-zinc-600 mt-0.5">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ParsedJDView;
