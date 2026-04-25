import { useApp } from '../../context/AppContext.jsx';

const COLORS_DARK = [
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
];

const COLORS_LIGHT = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-violet-100 text-violet-700 border-violet-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
];

const hashStr = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return Math.abs(hash);
};

export const SkillTag = ({ skill, matched = null, size = 'sm' }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;

  const colorClass = matched === true
    ? isDark
      ? 'bg-blue-500/25 text-blue-200 border-blue-400/40'
      : 'bg-blue-100 text-blue-700 border-blue-300'
    : matched === false
    ? isDark
      ? 'bg-zinc-800/60 text-zinc-500 border-zinc-700/40 line-through opacity-60'
      : 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60'
    : COLORS[hashStr(skill) % COLORS.length];

  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClass} ${colorClass} whitespace-nowrap`}>
      {skill}
    </span>
  );
};

export default SkillTag;
