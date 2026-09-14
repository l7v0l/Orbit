'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function PostComposer({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from('posts').insert([
          {
            user_id: user.id,
            content: content.trim(),
          },
        ]);

        if (error) {
          console.error('Error creating post:', error.message);
        }
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setContent('');
      setLoading(false);
      if (onPostCreated) onPostCreated();
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
            <button type="button" className="p-2 hover:bg-slate-800/80 rounded-xl text-blue-400 transition-colors">
              🖼️
            </button>
            <button type="button" className="p-2 hover:bg-slate-800/80 rounded-xl text-purple-400 transition-colors">
              📊
            </button>
            <button type="button" className="p-2 hover:bg-slate-800/80 rounded-xl text-pink-400 transition-colors">
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
