export default function MessDetailsSkeleton() {
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-slate-950 via-black to-slate-900 animate-pulse">

      {/* TOP BANNER */}
      <div className="w-full h-64 sm:h-80 md:h-96 bg-slate-800/50 rounded-b-3xl"></div>

      {/* DETAILS SECTION */}
      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
          
          <div className="h-7 bg-slate-800/50 rounded w-1/3"></div>
          <div className="mt-3 h-4 bg-slate-800/50 rounded w-2/3"></div>

          <div className="mt-4 h-4 bg-slate-800/50 rounded w-1/2"></div>

          <div className="mt-6 flex gap-3">
            <div className="h-10 bg-slate-800/50 rounded-xl w-32"></div>
            <div className="h-10 bg-slate-800/50 rounded-xl w-32"></div>
          </div>

        </div>
      </div>

      {/* IMAGE GRID */}
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="h-6 bg-slate-800/50 rounded w-28 mb-4"></div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <div className="h-28 bg-slate-800/50 rounded-xl"></div>
          <div className="h-28 bg-slate-800/50 rounded-xl"></div>
          <div className="h-28 bg-slate-800/50 rounded-xl"></div>
          <div className="h-28 bg-slate-800/50 rounded-xl"></div>
        </div>
      </div>

    </div>
  );
}
