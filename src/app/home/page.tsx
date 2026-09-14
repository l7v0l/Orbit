'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Widgets from '@/components/layout/Widgets';
import PostComposer from '@/components/posts/PostComposer';
import PostFeed from '@/components/posts/PostFeed';
import { supabase } from '@/lib/supabase/client';

export default function HomePage() {
  const [createdPost, setCreatedPost] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Fetch logged-in user profile from Supabase Auth & profiles table
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          setUserProfile({
            id: user.id,
            ...(profile || user.user_metadata || { full_name: 'مستخدم Orbit', username: 'user' }),
          });
        }
      } catch (e) {
        console.warn('User profile fetch notice:', e);
      }
    };
    getProfile();
  }, []);

  const handlePostCreated = (post: any) => {
    setCreatedPost(post);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between min-h-screen">
        {/* Column 1: Sidebar (Right side in RTL) */}
        <Sidebar userProfile={userProfile} />

        {/* Column 2: Center Timeline / Feed */}
        <main className="flex-1 border-r border-l border-slate-800 max-w-2xl min-h-screen pb-16">
          {/* Header Bar */}
          <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-100">الرئيسية (Home)</h1>
            <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
              Orbit Live Feed 🟢
            </span>
          </header>

          {/* New Post Input Box */}
          <PostComposer onPostCreated={handlePostCreated} />

          {/* Posts Feed Timeline */}
          <PostFeed
            newPost={createdPost}
            currentUserId={userProfile?.id}
            currentUserRole={userProfile?.role || 'admin'}
          />
        </main>

        {/* Column 3: Widgets & Trends (Left side in RTL) */}
        <Widgets />
      </div>
    </div>
  );
}
