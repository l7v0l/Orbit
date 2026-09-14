'use client';

import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { supabase } from '@/lib/supabase/client';

const initialDemoPosts = [
  {
    id: 'demo-1',
    user_id: 'demo-user-1',
    content: 'مرحباً بكم في شبكة Orbit! 🌌 المنصة تعمل الآن حقيقية ومباشرة مع دعم شارة التوثيق وصلاحيات المدير العام (Super Admin).',
    created_at: new Date().toISOString(),
    likes_count: 36,
    profiles: {
      full_name: 'فريق Orbit الرسمي',
      username: 'orbit_team',
      is_verified: true,
      role: 'admin',
    },
  },
  {
    id: 'demo-2',
    user_id: 'demo-user-2',
    content: 'تم تفعيل نظام توثيق الحسابات مع الإدارة الكاملة للتحكم في المنشورات والمستخدمين 🚀',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes_count: 18,
    profiles: {
      full_name: 'سارة أحمد',
      username: 'sara_dev',
      is_verified: false,
    },
  },
];

export default function PostFeed({
  newPost = null,
  currentUserId = null,
  currentUserRole = null,
}) {
  const [posts, setPosts] = useState(initialDemoPosts);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*, profiles(full_name, username, avatar_url, is_verified, role)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.warn('Fetched posts fallback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Prepend newly created post
  useEffect(() => {
    if (newPost) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  }, [newPost]);

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
  };

  return (
    <div className="divide-y divide-slate-800">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          onDeletePost={handleDeletePost}
        />
      ))}
    </div>
  );
}
