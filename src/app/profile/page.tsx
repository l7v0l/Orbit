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
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const getProfileAndUserPosts = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        let profileData: any = null;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          profileData = {
            id: user.id,
            email: user.email,
            ...(profile || user.user_metadata || { full_name: 'المدير العام (Super Admin)', username: 'l7v0l', is_verified: true, role: 'admin' }),
          };

          setUserProfile(profileData);

          // Fetch posts created by this user
          const { data: posts } = await supabase
            .from('posts')
            .select('*, profiles(full_name, username, avatar_url, is_verified, role)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (posts && posts.length > 0) {
            setUserPosts(posts);
          } else {
            // Demo post fallback if no DB posts yet
            setUserPosts([
              {
                id: 'my-post-1',
                user_id: user.id,
                content: 'مرحباً بكم في ملفي الشخصي في منصة Orbit 🌌 منصة التدوين المصغر القادمة بقوة!',
                created_at: new Date().toISOString(),
                likes_count: 24,
                profiles: profileData,
              },
            ]);
          }

          // Fetch liked posts from Supabase DB
          const { data: likes } = await supabase
            .from('likes')
            .select('post_id, posts(*, profiles(full_name, username, avatar_url, is_verified, role))')
            .eq('user_id', user.id);

          if (likes && likes.length > 0) {
            const formattedLikes = likes.map((l: any) => l.posts).filter(Boolean);
            setLikedPosts(formattedLikes);
          }
        } else {
          // Demo Admin Profile fallback
          profileData = {
            id: 'admin-1',
            full_name: 'المدير العام (Super Admin)',
            username: 'l7v0l',
            bio: 'مطور منصة Orbit والمدير العام لشعارات وتوثيق الحسابات 🚀',
            is_verified: true,
            role: 'admin',
          };
          setUserProfile(profileData);

          setUserPosts([
            {
              id: 'my-post-1',
              user_id: 'admin-1',
              content: 'مرحباً بكم في منصة Orbit! تم إطلاق جميع المميزات والصفحات بنجاح 🚀🌌',
              created_at: new Date().toISOString(),
              likes_count: 48,
              profiles: profileData,
            },
          ]);
        }

        // Merge liked posts from LocalStorage
        try {
          const localLikes: any[] = JSON.parse(localStorage.getItem('orbit_liked_posts') || '[]');
          if (localLikes.length > 0) {
            setLikedPosts((prev) => {
              const map = new Map();
              [...localLikes, ...prev].forEach((p) => {
                if (p && p.id) map.set(p.id, p);
              });
              return Array.from(map.values());
            });
          }
        } catch (e) {}
      } catch (err) {
        console.warn('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    getProfileAndUserPosts();
  }, []);

  // Filter posts with media (images or videos)
  const mediaPosts = userPosts.filter(
    (post) => (post.media_urls && post.media_urls.length > 0) || post.image_url
  );

  const handleDeletePost = (postId: string) => {
    setUserPosts((prev) => prev.filter((p) => p.id !== postId));
  };

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

              <div className="flex gap-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-5 py-2 text-sm font-bold rounded-full transition-all ${
                    isFollowing
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-red-500/20 hover:text-red-300'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg'
                  }`}
                >
                  {isFollowing ? 'تتابع الآن ✓' : 'متابعة 👤'}
                </button>
              </div>
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
                <span className="text-sm text-slate-400 dir-ltr block">
                  @{userProfile?.username || 'orbit_user'}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {userProfile?.bio || 'مرحباً بكم في حسابي الرسمي على منصة Orbit! 🌌 أحب التكنولوجيا والتدوين المصغر.'}
              </p>

              {/* Followers & Following Stats */}
              <div className="flex gap-6 text-sm text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="hover:text-purple-400 cursor-pointer transition-colors">
                  <strong className="text-slate-100 font-bold ml-1">142</strong>
                  <span>متابَعين (Following)</span>
                </div>
                <div className="hover:text-blue-400 cursor-pointer transition-colors">
                  <strong className="text-slate-100 font-bold ml-1">
                    {isFollowing ? '1,201' : '1,200'}
                  </strong>
                  <span>متابِعون (Followers)</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile Tabs Navigation */}
          <div className="mt-6 border-b border-slate-800 flex text-center font-bold text-sm text-slate-400">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 transition-colors relative ${
                activeTab === 'posts' ? 'text-slate-100 border-b-2 border-purple-500' : 'hover:text-slate-200'
              }`}
            >
              المنشورات ({userPosts.length})
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 py-3 transition-colors relative ${
                activeTab === 'media' ? 'text-slate-100 border-b-2 border-purple-500' : 'hover:text-slate-200'
              }`}
            >
              الوسائط ({mediaPosts.length})
            </button>

            <button
              onClick={() => setActiveTab('likes')}
              className={`flex-1 py-3 transition-colors relative ${
                activeTab === 'likes' ? 'text-slate-100 border-b-2 border-purple-500' : 'hover:text-slate-200'
              }`}
            >
              الإعجابات ({likedPosts.length})
            </button>
          </div>

          {/* Profile Tab Feed Content */}
          <div className="p-4">
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm animate-pulse">
                جاري تحميل محتوى الملف الشخصي...
              </div>
            ) : activeTab === 'posts' ? (
              userPosts.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {userPosts.map((post) => (
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
                <div className="text-center py-12 text-slate-500 text-sm">
                  لا توجد منشورات مكتوبة بعد.
                </div>
              )
            ) : activeTab === 'media' ? (
              mediaPosts.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {mediaPosts.map((post) => (
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
                  <div className="text-4xl mb-3">🖼️</div>
                  <h3 className="font-bold text-lg text-slate-200 mb-2">لا توجد وسائط مرفوعة</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    عندما تقوم برفع صور أو فيديوهات في منشوراتك، ستظهر جميع الوسائط الخاصة بك في هذا التبويب.
                  </p>
                </div>
              )
            ) : (
              likedPosts.length > 0 ? (
                <div className="divide-y divide-slate-800">
                  {likedPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={userProfile?.id}
                      currentUserRole={userProfile?.role}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 my-4 p-8">
                  <div className="text-4xl mb-3">❤️</div>
                  <h3 className="font-bold text-lg text-slate-200 mb-2">لم تقم بالإعجاب بأي منشورات بعد</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    اضغط على أيقونة الإعجاب ❤️ في أي منشور، وستظهر المنشورات التي نالت إعجابك هنا.
                  </p>
                </div>
              )
            )}
          </div>
        </main>

        {/* Widgets */}
        <Widgets />
      </div>
    </div>
  );
}
