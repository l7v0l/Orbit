import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full p-6 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-8 bg-slate-900 rounded-xl w-1/3 mx-auto" />
        
        {/* Post Input Skeleton */}
        <div className="p-4 bg-slate-900/60 rounded-2xl space-y-3 border border-slate-800">
          <div className="h-16 bg-slate-800/60 rounded-xl" />
          <div className="flex justify-between items-center">
            <div className="h-6 w-24 bg-slate-800 rounded-lg" />
            <div className="h-9 w-24 bg-purple-600/40 rounded-full" />
          </div>
        </div>

        {/* Posts Skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-800/60 rounded w-1/6" />
              </div>
            </div>
            <div className="h-12 bg-slate-800/40 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
