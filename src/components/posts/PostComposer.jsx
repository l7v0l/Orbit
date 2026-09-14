'use client';

import React, { useState } from 'react';

export default function PostComposer({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    // Submit logic connected to Supabase will go here
    console.log('Publishing post:', content);
    setTimeout(() => {
      setContent('');
      setLoading(false);
      if (onPostCreated) onPostCreated();
    }, 500);
  };

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ماذا يدور في ذهنك على Orbit؟"
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-base"
        />

        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div className="flex gap-2 text-slate-400">
            <button type="button" className="p-2 hover:bg-slate-800 rounded-lg text-blue-400 hover:text-blue-300">
              🖼️
            </button>
            <button type="button" className="p-2 hover:bg-slate-800 rounded-lg text-purple-400 hover:text-purple-300">
              😃
            </button>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="px-5 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-full transition-all"
          >
            {loading ? 'جاري النشر...' : 'نشر'}
          </button>
        </div>
      </form>
    </div>
  );
}
