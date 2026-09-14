'use client';

import React, { useState } from 'react';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all mb-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
          {post?.profiles?.username?.[0]?.toUpperCase() || 'O'}
        </div>
        <div>
          <h4 className="font-semibold text-slate-200 text-sm">
            {post?.profiles?.full_name || 'Orbit User'}
          </h4>
          <span className="text-xs text-slate-500">
            @{post?.profiles?.username || 'orbit_user'} • {post?.created_at ? new Date(post.created_at).toLocaleDateString('ar-EG') : 'الآن'}
          </span>
        </div>
      </div>

      {/* Content */}
      <p className="text-slate-300 text-base leading-relaxed mb-4">
        {post?.content || 'مرحباً بكم في شبكة Orbit للتدوين المصغر!'}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-slate-400 text-sm">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-pink-500 font-bold' : 'hover:text-pink-400'}`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likesCount}</span>
        </button>

        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
          <span>💬</span>
          <span>تعليق</span>
        </button>

        <button className="flex items-center gap-1.5 hover:text-purple-400 transition-colors">
          <span>🔁</span>
          <span>إعادة نشر</span>
        </button>
      </div>
    </article>
  );
}
