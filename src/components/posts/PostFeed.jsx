'use client';

import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { supabase } from '@/lib/supabase/client';

const initialDemoPosts = [
  {
    id: 'demo-1',
    content: 'مرحباً بكم في شبكة Orbit! 🌌 المنصة تعمل الآن بتقنيات Next.js App Router و Supabase و Tailwind CSS مع هوية بصرية مذهلة.',
    created_at: new Date().toISOString(),
    likes_count: 24,
    profiles: {
      full_name: 'فريق Orbit',
      username: 'orbit_team',
    },
  },
  {
    id: 'demo-2',
    content: 'تم تفعيل نظام المصادقة (Auth) وتقسيم الواجهة لـ 3 أعمدة تفاعلية مطابقة لتجربة مستخدم X. ما رأيكم بالتصميم الحالي؟ 🚀',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes_count: 12,
    profiles: {
      full_name: 'سارة أحمد',
      username: 'sara_dev',
    },
  },
];

export default function PostFeed({ refreshTrigger }) {
  const [posts, setPosts] = useState(initialDemoPosts);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(full_name, username, avatar_url)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.warn('Using demo posts due to network/auth status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  return (
    <div className="divide-y divide-slate-800">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
