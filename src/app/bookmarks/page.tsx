'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Widgets from '@/components/layout/Widgets';
import PostCard from '@/components/posts/PostCard';
import { supabase } from '@/lib/supabase/client';

export default function BookmarksPage() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserProfile({
            id: user.id,
            ...(user.user_metadata || { full_name: 'مستخدم Orbit', username: 'user' }),
          });
        }

        // 1. Get bookmarks from localStorage
        let localBookmarks: any[] = [];
        try {
          localBookmarks = JSON.parse(localStorage.getItem('orbit_bookmarks_posts') || '[]');
        } catch (e) {}

        // 2. Get bookmarks from Supabase DB if user is logged in
        let dbPosts: any[] = [];
        if (user) {
          const { data: bookmarks, error } = await supabase
            .from('bookmarks')
            .select('post_id, posts(*, profiles(full_name, username, avatar_url, is_verified, role))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && bookmarks && bookmarks.length > 0) {
            dbPosts = bookmarks
              .map((b: any) => b.posts)
              .filter(Boolean)
              .map((p: any) => ({ ...p, is_bookmarked: true }));
          }
        }

        // Merge local & DB bookmarks uniquely by ID
        const combinedMap = new Map();
        [...localBookmarks, ...dbPosts].forEach((p) => {
          if (p && p.id) {
            combinedMap.set(p.id, { ...p, is_bookmarked: true });
          }
        });

        setBookmarkedPosts(Array.from(combinedMap.values()));
      } catch (err) {
        console.warn('Bookmarks fetch fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedPosts();
  }, []);

  const handleDeletePost = (postId: string) => {
    setBookmarkedPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      let storedBookmarks: any[] = JSON.parse(localStorage.getItem('orbit_bookmarks_posts') || '[]');
      storedBookmarks = storedBookmarks.filter((p) => p.id !== postId);
      localStorage.setItem('orbit_bookmarks_posts', JSON.stringify(storedBookmarks));
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between min-h-screen">
        {/* Column 1: Sidebar */}
        <Sidebar userProfile={userProfile} />

        {/* Column 2: Bookmarks Timeline */}
        <main className="flex-1 border-r border-l border-slate-800 max-w-2xl min-h-screen pb-16">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100">المفضلة (Bookmarks)</h1>
              <p className="text-xs text-slate-400">المنشورات التي قمت بحفظها للرجوع إليها لاحقاً</p>
            </div>
            <span className="text-xl">🔖</span>
          </header>

          {/* Bookmarked Feed */}
          <div className="p-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm animate-pulse">
                جاري تحميل منشوراتك المفضلة...
              </div>
            ) : bookmarkedPosts.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {bookmarkedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={userProfile?.id}
                    currentUserRole={userProfile?.role}
                    onDeletePost={handleDeletePost}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 my-4 p-8">
                <div className="text-4xl mb-3">🔖</div>
                <h3 className="font-bold text-lg text-slate-200 mb-2">لم تقم بحفظ أي منشورات بعد</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  عندما تجد تغريدة تعجبك، اضغط على أيقونة المفضلة 🔖 لحفظها وسهولة الوصول إليها هنا في أي وقت.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Column 3: Widgets */}
        <Widgets />
      </div>
    </div>
  );
}
