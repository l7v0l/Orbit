'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Widgets from '@/components/layout/Widgets';
import PostCard from '@/components/posts/PostCard';
import { supabase } from '@/lib/supabase/client';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [explorePosts, setExplorePosts] = useState<any[]>([]);

  useEffect(() => {
    const getProfileAndPosts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserProfile({ id: user.id, ...(user.user_metadata || {}) });
        }

        const { data: posts } = await supabase
          .from('posts')
          .select('*, profiles(full_name, username, avatar_url, is_verified, role)')
          .order('created_at', { ascending: false })
          .limit(10);

        if (posts && posts.length > 0) {
          setExplorePosts(posts);
        }
      } catch (err) {
        console.warn('Explore fetch fallback:', err);
      }
    };

    getProfileAndPosts();
  }, []);

  const trendingTopics = [
    { tag: '#Orbit_NextJS', category: 'تكنولوجيا • متداول', posts: '28.4K' },
    { tag: '#Supabase_Auth', category: 'برمجة • متداول في المملكة', posts: '14.1K' },
    { tag: '#AI_Agents', category: 'ذكاء اصطناعي • تريند عالمي', posts: '95.8K' },
    { tag: '#TailwindCSS', category: 'تصميم الواجهات', posts: '12.3K' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between min-h-screen">
        {/* Sidebar */}
        <Sidebar userProfile={userProfile} />

        {/* Explore Timeline */}
        <main className="flex-1 border-r border-l border-slate-800 max-w-2xl min-h-screen pb-16">
          {/* Search Header */}
          <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث في Orbit عن مواضيع، منشورات، أو حسابات..."
                className="w-full bg-slate-900 border border-slate-800 rounded-full pl-4 pr-10 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
              />
              <span className="absolute right-3.5 top-3.5 text-slate-500 text-sm">🔍</span>
            </div>
          </header>

          {/* Trending Topics Grid */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/40">
            <h2 className="font-extrabold text-slate-100 text-lg mb-4 flex items-center gap-2">
              <span>🔥</span>
              <span>الموضوعات المتداولة (Explore Trends)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trendingTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-all cursor-pointer group"
                >
                  <span className="text-xs text-slate-500 block">{topic.category}</span>
                  <span className="font-bold text-base text-slate-100 group-hover:text-purple-400 transition-colors block mt-1">
                    {topic.tag}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">{topic.posts} منشور</span>
                </div>
              ))}
            </div>
          </div>

          {/* Explore Feed */}
          <div className="p-4">
            <h3 className="font-bold text-slate-300 text-base mb-4">أحدث التغريدات والوسائط</h3>
            <div className="divide-y divide-slate-800">
              {explorePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={userProfile?.id}
                  currentUserRole={userProfile?.role}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Widgets */}
        <Widgets />
      </div>
    </div>
  );
}
