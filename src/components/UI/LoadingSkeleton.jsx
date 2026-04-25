export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-zinc-800 rounded ${className}`} />
);

export const CardSkeleton = () => (
  <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl p-4 space-y-3">
    <div className="flex items-start gap-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="w-12 h-6 rounded-full" />
    </div>
    <div className="flex gap-1.5 flex-wrap">
      {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-5 w-16 rounded-full" />)}
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-[#1e1e2e]">
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <td key={i} className="px-4 py-3">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

export default Skeleton;
