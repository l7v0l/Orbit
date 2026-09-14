'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function PostComposer({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;

    setLoading(true);

    try {
      // 1. Get current authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      const newPostObj = {
        id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        content: text,
        created_at: new Date().toISOString(),
        likes_count: 0,
        profiles: {
          full_name: user?.user_metadata?.full_name || 'مستخدم Orbit',
          username: user?.user_metadata?.username || 'orbit_user',
          avatar_url: user?.user_metadata?.avatar_url || '',
        },
      };

      // 2. If user is logged in, save to Supabase
      if (user) {
        const { data, error } = await supabase
          .from('posts')
          .insert([
            {
              user_id: user.id,
              content: text,
            },
          ])
          .select('*, profiles(full_name, username, avatar_url)')
          .single();

        if (!error && data) {
          if (onPostCreated) onPostCreated(data);
        } else {
          if (onPostCreated) onPostCreated(newPostObj);
        }
      } else {
        // Fallback for immediate UI feedback if user browsing preview
        if (onPostCreated) onPostCreated(newPostObj);
      }
    } catch (err) {
      console.error('Post creation error:', err);
      // Fallback optimistic update
      if (onPostCreated) {
        onPostCreated({
          id: `post_${Date.now()}`,
          content: text,
          created_at: new Date().toISOString(),
          likes_count: 0,
          profiles: {
            full_name: 'مستخدم Orbit',
            username: 'orbit_user',
          },
        });
      }
    } finally {
      setContent('');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900/60 border-b border-slate-800">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm shrink-0">
            🚀
          </div>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ماذا يحدث في كوكبك الآن؟"
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-base leading-relaxed pt-1"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
          <div className="flex gap-1 text-slate-400">
            <button
              type="button"
              className="p-2 hover:bg-slate-800/80 rounded-xl text-blue-400 transition-colors"
              title="إضافة صورة"
            >
              🖼️
            </button>
            <button
              type="button"
              className="p-2 hover:bg-slate-800/80 rounded-xl text-purple-400 transition-colors"
              title="تصويت"
            >
              📊
            </button>
            <button
              type="button"
              className="p-2 hover:bg-slate-800/80 rounded-xl text-pink-400 transition-colors"
              title="رمز تعبيري"
            >
              😃
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 text-white rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'جاري النشر...' : 'نشر المنشور'}
          </button>
        </div>
      </form>
    </div>
  );
}
