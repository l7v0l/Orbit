'use client';

import React, { useState } from 'react';
import VerifiedBadge from '@/components/VerifiedBadge';
import { supabase } from '@/lib/supabase/client';

export default function PostCard({ post, currentUserId, currentUserRole, onDeletePost }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);

  const isAuthor = currentUserId && post?.user_id === currentUserId;
  const isAdmin = currentUserRole === 'admin';
  const canDelete = isAuthor || isAdmin;

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleDelete = async () => {
    if (!window.confirm('هل أنت تأكد من رغبتك في حذف هذا المنشور؟')) return;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) {
        console.error('Delete error:', error.message);
      }
      if (onDeletePost) {
        onDeletePost(post.id);
      }
    } catch (err) {
      console.error('Delete action failed:', err);
    }
  };

  return (
    <article className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            {post?.profiles?.username?.[0]?.toUpperCase() || 'O'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-slate-200 text-sm">
                {post?.profiles?.full_name || 'Orbit User'}
              </h4>
              {/* Show Verified Badge if user is verified or if team */}
              {(post?.profiles?.is_verified || post?.profiles?.username === 'orbit_team' || post?.profiles?.username === 'l7v0l') && (
                <VerifiedBadge size={16} />
              )}
            </div>
            <span className="text-xs text-slate-500 dir-ltr">
              @{post?.profiles?.username || 'orbit_user'} • {post?.created_at ? new Date(post.created_at).toLocaleDateString('ar-EG') : 'الآن'}
            </span>
          </div>
        </div>

        {/* Admin or Author Delete Action */}
        {canDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-xs flex items-center gap-1"
            title="حذف المنشور (صلاحيات المدير/صاحب المنشور)"
          >
            <span>🗑️</span>
            {isAdmin && !isAuthor && <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">Admin</span>}
          </button>
        )}
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
