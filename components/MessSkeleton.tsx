export function MessSkeleton() {
  return (
    <div className="animate-pulse border border-slate-200 bg-slate-100/40 backdrop-blur-xl rounded-2xl p-5">
      <div className="w-full h-40 bg-slate-800/50 rounded-xl"></div>

      <div className="mt-4 h-4 bg-slate-400/10 rounded w-3/4"></div>
      <div className="mt-2 h-3 bg-slate-400/10 rounded w-1/2"></div>

      <div className="mt-4 h-4 bg-slate-400/10 rounded w-1/4"></div>
      <div className="mt-2 h-3 bg-slate-400/10 rounded w-full"></div>

      <div className="mt-6 h-8 bg-slate-400/10 rounded-xl"></div>
    </div>
  );
}
