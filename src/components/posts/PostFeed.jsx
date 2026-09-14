'use client';

import React, { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { supabase } from '@/lib/supabase/client';

const initialDemoPosts = [
  {
    id: 'demo-1',
    content: 'مرحباً بكم في شبكة Orbit! 🌌 المنصة تعمل الآن حقيقية ومباشرة بتقنيات Next.js App Router و Supabase مع التفاعل المباشر.',
    created_at: new Date().toISOString(),
    likes_count: 24,
    profiles: {
      full_name: 'فريق Orbit الرسمي',
      username: 'orbit_team',
    },
  },
  {
    id: 'demo-2',
    content: 'تم تفعيل نظام المصادقة (Auth) والتفاعل مع الجداول مباشرة! اكتب منشورك الآن واشعر بالسرعة 🚀',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes_count: 12,
    profiles: {
      full_name: 'سارة أحمد',
      username: 'sara_dev',
    },
  },
];

export default function PostFeed({ newPost }) {
  const [posts, setPosts] = useState(initialDemoPosts);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Supabase on mount
  useEffect(() => {
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
        console.warn('Fetched posts, fallback to initial demo posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Prepend newly created post immediately
  useEffect(() => {
    if (newPost) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
  }, [newPost]);

  return (
    <div className="divide-y divide-slate-800">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
