'use client';

import React, { useState, useEffect } from 'react';
import VerifiedBadge from '@/components/VerifiedBadge';
import { supabase } from '@/lib/supabase/client';

interface PostCardProps {
  post: any;
  currentUserId?: string | null;
  currentUserRole?: string | null;
  onDeletePost?: ((postId: string) => void) | null;
}

export default function PostCard({
  post,
  currentUserId = null,
  currentUserRole = null,
  onDeletePost = undefined,
}: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [bookmarked, setBookmarked] = useState(post?.is_bookmarked || false);

  const isAuthor = currentUserId && post?.user_id === currentUserId;
  const isAdmin = currentUserRole === 'admin';
  const canDelete = isAuthor || isAdmin;

  const mediaUrls = post?.media_urls || (post?.image_url ? [post.image_url] : []);
  const mediaType = post?.media_type || (post?.image_url ? 'image' : 'image');

  useEffect(() => {
    try {
      const storedBookmarks: any[] = JSON.parse(localStorage.getItem('orbit_bookmarks_posts') || '[]');
      if (storedBookmarks.some((p) => p.id === post?.id)) {
        setBookmarked(true);
      }

      const storedLikes: any[] = JSON.parse(localStorage.getItem('orbit_liked_posts') || '[]');
      if (storedLikes.some((p) => p.id === post?.id)) {
        setLiked(true);
      }
    } catch (e) {}
  }, [post?.id]);

  const toggleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((prev: number) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    // Save/Remove from LocalStorage for Likes tab in Profile
    try {
      let storedLikes: any[] = JSON.parse(localStorage.getItem('orbit_liked_posts') || '[]');
      if (nextLiked) {
        if (post && !storedLikes.some((p) => p.id === post.id)) {
          storedLikes.unshift({ ...post, is_liked: true });
        }
      } else {
        storedLikes = storedLikes.filter((p) => p.id !== post.id);
      }
      localStorage.setItem('orbit_liked_posts', JSON.stringify(storedLikes));
    } catch (e) {
      console.error('Like localStorage error:', e);
    }

    // Sync with Supabase likes DB table if user is logged in
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post?.id);
    if (currentUserId && isUuid) {
      try {
        if (nextLiked) {
          await supabase.from('likes').insert([{ user_id: currentUserId, post_id: post.id }]);
        } else {
          await supabase.from('likes').delete().eq('user_id', currentUserId).eq('post_id', post.id);
        }
      } catch (err) {
        console.warn('Supabase like sync notice:', err);
      }
    }
  };

  const toggleBookmark = async () => {
    const nextState = !bookmarked;
    setBookmarked(nextState);

    // Save/Remove from LocalStorage instantly
    try {
      let storedBookmarks: any[] = JSON.parse(localStorage.getItem('orbit_bookmarks_posts') || '[]');
      if (nextState) {
        if (post && !storedBookmarks.some((p) => p.id === post.id)) {
          storedBookmarks.unshift({ ...post, is_bookmarked: true });
        }
      } else {
        storedBookmarks = storedBookmarks.filter((p) => p.id !== post.id);
      }
      localStorage.setItem('orbit_bookmarks_posts', JSON.stringify(storedBookmarks));
    } catch (e) {
      console.error('Bookmark localStorage error:', e);
    }

    // Sync with Supabase DB if user is logged in & post.id is UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post?.id);
    try {
      if (currentUserId && isUuid) {
        if (nextState) {
          await supabase.from('bookmarks').insert([{ user_id: currentUserId, post_id: post.id }]);
        } else {
          await supabase.from('bookmarks').delete().eq('user_id', currentUserId).eq('post_id', post.id);
        }
      }
    } catch (err) {
      console.warn('Supabase bookmark sync notice:', err);
    }
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
              {(post?.profiles?.is_verified || post?.profiles?.username === 'orbit_team' || post?.profiles?.username === 'l7v0l') && (
                <VerifiedBadge size={16} />
              )}
            </div>
            <span className="text-xs text-slate-500 dir-ltr">
              @{post?.profiles?.username || 'orbit_user'} • {post?.created_at ? new Date(post.created_at).toLocaleDateString('ar-EG') : 'الآن'}
            </span>
          </div>
        </div>

        {/* Delete Action */}
        {canDelete && (
          <button
            onClick={handleDelete}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-xs flex items-center gap-1"
            title="حذف المنشور"
          >
            <span>🗑️</span>
            {isAdmin && !isAuthor && <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-bold">Admin</span>}
          </button>
        )}
      </div>

      {/* Content Text */}
      {post?.content && (
        <p className="text-slate-300 text-base leading-relaxed mb-3 whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Media Display */}
      {mediaUrls.length > 0 && (
        <div className="mb-4 rounded-2xl overflow-hidden border border-slate-800">
          {mediaType === 'video' ? (
            <video src={mediaUrls[0]} controls className="w-full max-h-[480px] object-cover rounded-2xl" />
          ) : (
            <div
              className={`grid gap-1 ${
                mediaUrls.length === 1
                  ? 'grid-cols-1'
                  : mediaUrls.length === 2
                  ? 'grid-cols-2'
                  : mediaUrls.length === 3
                  ? 'grid-cols-2'
                  : 'grid-cols-2'
              }`}
            >
              {mediaUrls.map((url: string, idx: number) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden bg-slate-950 ${
                    mediaUrls.length === 3 && idx === 0 ? 'row-span-2 h-full' : 'h-48'
                  }`}
                >
                  <img
                    src={url}
                    alt={`post-media-${idx}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

        <button
          onClick={toggleBookmark}
          className={`flex items-center gap-1.5 transition-colors ${
            bookmarked ? 'text-amber-400 font-bold' : 'hover:text-amber-400'
          }`}
          title={bookmarked ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
        >
          <span>{bookmarked ? '🔖' : '🏷️'}</span>
          <span className="hidden sm:inline">{bookmarked ? 'محفوظ' : 'المفضلة'}</span>
        </button>
      </div>
    </article>
  );
}
