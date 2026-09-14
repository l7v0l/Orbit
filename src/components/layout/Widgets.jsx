'use client';

import React from 'react';

export default function Widgets() {
  const trends = [
    { category: 'التريند في الشرق الأوسط', tag: '#Orbit_NextJS', postsCount: '15.4K' },
    { category: 'تكنولوجيا وبرمجة', tag: '#Supabase_Auth', postsCount: '8.2K' },
    { category: 'ذكاء اصطناعي', tag: '#AI_Agents', postsCount: '42.1K' },
    { category: 'تصميم الواجهات', tag: '#TailwindCSS', postsCount: '6.9K' },
  ];

  const suggestedUsers = [
    { name: 'سارة خالد', username: 'sara_tech', avatar: '👩‍💻' },
    { name: 'فريق Orbit', username: 'orbit_official', avatar: '🚀' },
    { name: 'محمد علي', username: 'mohamed_dev', avatar: '👨‍💻' },
  ];

  return (
    <aside className="w-80 p-4 hidden lg:block sticky top-0 h-screen overflow-y-auto space-y-4 border-r border-slate-800 bg-slate-950/40">
      {/* Search Input */}
      <div className="sticky top-0 bg-slate-950/90 backdrop-blur-md pb-2 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="بحث في Orbit..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full pl-4 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
          />
          <span className="absolute right-3.5 top-2.5 text-slate-500 text-sm">🔍</span>
        </div>
      </div>

      {/* Trends Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <h3 className="font-bold text-slate-100 text-base mb-3">متداول لـك (Trends)</h3>
        <div className="space-y-3">
          {trends.map((trend, idx) => (
            <div key={idx} className="group cursor-pointer">
              <span className="text-xs text-slate-500 block">{trend.category}</span>
              <span className="font-bold text-sm text-slate-200 group-hover:text-purple-400 transition-colors block">
                {trend.tag}
              </span>
              <span className="text-xs text-slate-500 block">{trend.postsCount} منشور</span>
            </div>
          ))}
        </div>
      </div>

      {/* Who to Follow */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <h3 className="font-bold text-slate-100 text-base mb-3">اقتراحات المتابعة</h3>
        <div className="space-y-3">
          {suggestedUsers.map((user, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-base">
                  {user.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">{user.name}</h4>
                  <span className="text-xs text-slate-500">@{user.username}</span>
                </div>
              </div>
              <button className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-200 rounded-full transition-colors">
                متابعة
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
