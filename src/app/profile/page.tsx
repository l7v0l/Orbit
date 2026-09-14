'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Widgets from '@/components/layout/Widgets';
import PostCard from '@/components/posts/PostCard';
import VerifiedBadge from '@/components/VerifiedBadge';
import { supabase } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProfileAndUserPosts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          const profileData = {
            id: user.id,
            email: user.email,
            ...(profile || user.user_metadata || { full_name: 'المدير العام (Super Admin)', username: 'l7v0l', is_verified: true, role: 'admin' }),
          };

          setUserProfile(profileData);

          // Fetch posts by this user
          const { data: posts } = await supabase
            .from('posts')
            .select('*, profiles(full_name, username, avatar_url, is_verified, role)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (posts && posts.length > 0) {
            setUserPosts(posts);
          } else {
            // Default demo post if no Supabase posts yet
            setUserPosts([
              {
                id: 'my-post-1',
                user_id: user.id,
                content: 'مرحباً بكم في ملفي الشخصي في منصة Orbit 🌌',
                created_at: new Date().toISOString(),
                likes_count: 15,
                profiles: profileData,
              },
            ]);
          }
        } else {
          // Demo Admin Profile fallback
          setUserProfile({
            id: 'admin-1',
            full_name: 'المدير العام (Super Admin)',
            username: 'l7v0l',
            bio: 'مطور منصة Orbit والمدير العام لشعارات وتوثيق الحسابات 🚀',
            is_verified: true,
            role: 'admin',
          });
        }
      } catch (err) {
        console.warn('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    getProfileAndUserPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between min-h-screen">
        {/* Sidebar */}
        <Sidebar userProfile={userProfile} />

        {/* Profile Main Panel */}
        <main className="flex-1 border-r border-l border-slate-800 max-w-2xl min-h-screen pb-16">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-slate-100 flex items-center gap-1.5">
                <span>{userProfile?.full_name || 'الملف الشخصي'}</span>
                {(userProfile?.is_verified || userProfile?.username === 'l7v0l') && <VerifiedBadge size={16} />}
              </h1>
              <p className="text-xs text-slate-400">{userPosts.length} منشورات</p>
            </div>
          </header>

          {/* Banner & Avatar Header */}
          <div className="relative">
            {/* Gradient Cover Banner */}
            <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />

            {/* Profile Avatar & Actions Row */}
            <div className="px-6 flex justify-between items-end -mt-14 mb-4">
              <div className="w-24 h-24 rounded-full bg-slate-950 p-1 border-4 border-slate-950 shadow-2xl relative">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-extrabold text-white">
                  {userProfile?.full_name?.[0]?.toUpperCase() || 'O'}
                </div>
              </div>

              <button className="px-5 py-2 text-sm font-bold bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 rounded-full transition-all hover:scale-105">
                تعديل الملف الشخصي
              </button>
            </div>

            {/* Profile Info Details */}
            <div className="px-6 space-y-3">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>{userProfile?.full_name || 'مستخدم Orbit'}</span>
                  {(userProfile?.is_verified || userProfile?.username === 'l7v0l') && <VerifiedBadge size={18} />}
                  {userProfile?.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      Super Admin
                    </span>
                  )}
                </h2>
                <span className="text-sm text-slate-400 dir-ltr">
                  @{userProfile?.username || 'orbit_user'}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {userProfile?.bio || 'مرحباً بكم في حسابي الرسمي على منصة Orbit! 🌌 أحب التكنولوجيا والتدوين المصغر.'}
              </p>

              <div className="flex gap-6 text-sm text-slate-400 pt-2 border-t border-slate-800/80">
                <div>
                  <strong className="text-slate-100 font-bold">142</strong> متابَعين
                </div>
                <div>
                  <strong className="text-slate-100 font-bold">1.2K</strong> متابِعون
                </div>
              </div>
            </div>
          </div>

          {/* User Posts Timeline Tabs */}
          <div className="mt-6 border-b border-slate-800 flex text-center font-bold text-sm text-slate-400">
            <button className="flex-1 py-3 border-b-2 border-purple-500 text-slate-100">
              المنشورات ({userPosts.length})
            </button>
            <button className="flex-1 py-3 hover:text-slate-200 transition-colors">
              الوسائط
            </button>
            <button className="flex-1 py-3 hover:text-slate-200 transition-colors">
              الإعجابات
            </button>
          </div>

          {/* User Posts Feed List */}
          <div className="p-4 divide-y divide-slate-800">
            {userPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={userProfile?.id}
                currentUserRole={userProfile?.role}
              />
            ))}
          </div>
        </main>

        {/* Widgets */}
        <Widgets />
      </div>
    </div>
  );
}
