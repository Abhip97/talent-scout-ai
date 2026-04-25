import { X } from 'lucide-react';
import { ScoreBar } from '../UI/ScoreBar.jsx';
import { SkillTag } from '../UI/SkillTag.jsx';

const scoreKeys = [
  { key: 'skill', label: 'Skill Match' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'location', label: 'Location' },
  { key: 'availability', label: 'Availability' },
];

export const CompareView = ({ candidates, onRemove }) => {
  if (!candidates || candidates.length < 2) {
    return (
      <div className="text-center py-12 text-zinc-500 text-sm">
        Select 2–3 candidates from the match results to compare them side by side.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left py-3 pr-4 text-xs text-zinc-500 uppercase tracking-wider w-32">Attribute</th>
            {candidates.map((c) => (
              <th key={c.id} className="py-3 px-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-white text-sm">{c.name}</div>
                    <div className="text-xs text-zinc-400">{c.title}</div>
                  </div>
                  {onRemove && (
                    <button onClick={() => onRemove(c.id)} className="text-zinc-600 hover:text-rose-400 transition-colors mt-0.5">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Total Score</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4">
                <span className="text-2xl font-black text-white">{c.totalMatch}</span>
              </td>
            ))}
          </tr>
          {scoreKeys.map(({ key, label }) => (
            <tr key={key} className="border-t border-[#1e1e2e]">
              <td className="py-3 pr-4 text-xs text-zinc-500">{label}</td>
              {candidates.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <ScoreBar score={c.scores?.[key] || 0} height="h-1.5" />
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Skills</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {(c.skills || []).slice(0, 5).map((s) => <SkillTag key={s} skill={s} size="xs" />)}
                </div>
              </td>
            ))}
          </tr>
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Experience</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4 text-xs text-zinc-300">{c.yearsExperience} years</td>
            ))}
          </tr>
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Education</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4 text-xs text-zinc-300">
                {c.education ? `${c.education.degree} · ${c.education.college}` : 'Unknown'}
              </td>
            ))}
          </tr>
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Location</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4 text-xs text-zinc-300">{c.location}</td>
            ))}
          </tr>
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Salary (LPA)</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4 text-xs text-zinc-300">
                {c.expectedSalaryLPA ? `${c.expectedSalaryLPA.min}–${c.expectedSalaryLPA.max}` : 'N/A'}
              </td>
            ))}
          </tr>
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Notice</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4 text-xs text-zinc-300">{c.noticePeriod}</td>
            ))}
          </tr>
          <tr className="border-t border-[#1e1e2e]">
            <td className="py-3 pr-4 text-xs text-zinc-500">Status</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  c.jobSeekingStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400'
                  : c.jobSeekingStatus === 'passive' ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {c.jobSeekingStatus}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CompareView;
