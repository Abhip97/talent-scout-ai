import { X } from 'lucide-react';
import { ScoreBar } from '../UI/ScoreBar.jsx';
import { SkillTag } from '../UI/SkillTag.jsx';
import { useApp } from '../../context/AppContext.jsx';

const scoreKeys = [
  { key: 'skill', label: 'Skill Match' },
  { key: 'experience', label: 'Experience' },
  { key: 'education', label: 'Education' },
  { key: 'location', label: 'Location' },
  { key: 'availability', label: 'Availability' },
];

export const CompareView = ({ candidates, onRemove }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const rowBorder = isDark ? 'border-[#1e1e2e]' : 'border-slate-100';
  const label = isDark ? 'text-zinc-500' : 'text-gray-500';
  const cell = isDark ? 'text-zinc-300' : 'text-gray-700';
  const heading = isDark ? 'text-white' : 'text-gray-900';

  if (!candidates || candidates.length < 2) {
    return (
      <div className={`text-center py-12 text-sm ${label}`}>
        Select 2–3 candidates from the match results to compare them side by side.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className={`text-left py-3 pr-4 text-xs uppercase tracking-wider w-32 ${label}`}>Attribute</th>
            {candidates.map((c) => (
              <th key={c.id} className="py-3 px-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className={`font-semibold text-sm ${heading}`}>{c.name}</div>
                    <div className={`text-xs ${label}`}>{c.title}</div>
                  </div>
                  {onRemove && (
                    <button onClick={() => onRemove(c.id)} className={`transition-colors mt-0.5 hover:text-rose-400 ${label}`}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className={`border-t ${rowBorder}`}>
            <td className={`py-3 pr-4 text-xs ${label}`}>Total Score</td>
            {candidates.map((c) => (
              <td key={c.id} className="py-3 px-4">
                <span className={`text-2xl font-black ${heading}`}>{c.totalMatch}</span>
              </td>
            ))}
          </tr>
          {scoreKeys.map(({ key, label: keyLabel }) => (
            <tr key={key} className={`border-t ${rowBorder}`}>
              <td className={`py-3 pr-4 text-xs ${label}`}>{keyLabel}</td>
              {candidates.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <ScoreBar score={c.scores?.[key] || 0} height="h-1.5" />
                </td>
              ))}
            </tr>
          ))}
          {[
            { rowLabel: 'Skills', render: (c) => (
              <div className="flex flex-wrap gap-1">
                {(c.skills || []).slice(0, 5).map((s) => <SkillTag key={s} skill={s} size="xs" />)}
              </div>
            )},
            { rowLabel: 'Experience', render: (c) => <span className={`text-xs ${cell}`}>{c.yearsExperience} years</span> },
            { rowLabel: 'Education', render: (c) => (
              <span className={`text-xs ${cell}`}>
                {c.education ? `${c.education.degree} · ${c.education.college}` : 'Unknown'}
              </span>
            )},
            { rowLabel: 'Location', render: (c) => <span className={`text-xs ${cell}`}>{c.location}</span> },
            { rowLabel: 'Salary (LPA)', render: (c) => (
              <span className={`text-xs ${cell}`}>
                {c.expectedSalaryLPA ? `${c.expectedSalaryLPA.min}–${c.expectedSalaryLPA.max}` : 'N/A'}
              </span>
            )},
            { rowLabel: 'Notice', render: (c) => <span className={`text-xs ${cell}`}>{c.noticePeriod}</span> },
            { rowLabel: 'Status', render: (c) => (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                c.jobSeekingStatus === 'active' ? 'bg-emerald-500/20 text-emerald-400'
                : c.jobSeekingStatus === 'passive' ? 'bg-amber-500/20 text-amber-400'
                : 'bg-rose-500/20 text-rose-400'
              }`}>
                {c.jobSeekingStatus}
              </span>
            )},
          ].map(({ rowLabel, render }) => (
            <tr key={rowLabel} className={`border-t ${rowBorder}`}>
              <td className={`py-3 pr-4 text-xs ${label}`}>{rowLabel}</td>
              {candidates.map((c) => (
                <td key={c.id} className="py-3 px-4">{render(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompareView;
