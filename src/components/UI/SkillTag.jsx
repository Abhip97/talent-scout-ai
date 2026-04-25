const COLORS = [
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
];

const hashStr = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return Math.abs(hash);
};

export const SkillTag = ({ skill, matched = null, size = 'sm' }) => {
  const colorClass = matched === true
    ? 'bg-blue-500/25 text-blue-200 border-blue-400/40'
    : matched === false
    ? 'bg-zinc-800/60 text-zinc-500 border-zinc-700/40 line-through opacity-60'
    : COLORS[hashStr(skill) % COLORS.length];

  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizeClass} ${colorClass} whitespace-nowrap`}>
      {skill}
    </span>
  );
};

export default SkillTag;
