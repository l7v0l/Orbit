'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Widgets from '@/components/layout/Widgets';
import PostComposer from '@/components/posts/PostComposer';
import PostFeed from '@/components/posts/PostFeed';

export default function HomePage() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handlePostCreated = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between min-h-screen">
        {/* Column 1: Sidebar (Right side in RTL) */}
        <Sidebar />

        {/* Column 2: Center Timeline / Feed */}
        <main className="flex-1 border-r border-l border-slate-800 max-w-2xl min-h-screen pb-16">
          {/* Header Bar */}
          <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-100">الرئيسية (Home)</h1>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
              Orbit Live Feed
            </span>
          </header>

          {/* New Post Input Box */}
          <PostComposer onPostCreated={handlePostCreated} />

          {/* Posts Feed Timeline */}
          <PostFeed refreshTrigger={refreshCount} />
        </main>

        {/* Column 3: Widgets & Trends (Left side in RTL) */}
        <Widgets />
      </div>
    </div>
  );
}
