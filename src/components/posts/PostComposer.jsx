'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function PostComposer({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setErrorMsg('');
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const firstFile = files[0];
    const isVideo = firstFile.type.startsWith('video/');

    if (isVideo) {
      if (files.length > 1 || selectedFiles.length > 0) {
        setErrorMsg('يمكنك اختيار فيديو واحد فقط في المنشور الموحد.');
        return;
      }
      setMediaType('video');
      setSelectedFiles([firstFile]);
      setPreviews([URL.createObjectURL(firstFile)]);
    } else {
      // Images rule: Max 4 images
      const combined = [...selectedFiles.filter((f) => f.type.startsWith('image/')), ...files];
      if (combined.length > 4) {
        setErrorMsg('الحد الأقصى المسموح به هو 4 صور فقط لـكل منشور.');
        return;
      }
      setMediaType('image');
      setSelectedFiles(combined);
      setPreviews(combined.map((file) => URL.createObjectURL(file)));
    }
  };

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
    if (updatedFiles.length === 0) {
      setMediaType('image');
    }
  };

  const uploadMediaFiles = async () => {
    if (!selectedFiles.length) return [];

    const uploadedUrls = [];
    for (const file of selectedFiles) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `posts/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('orbit_media')
          .upload(filePath, file);

        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage
            .from('orbit_media')
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            uploadedUrls.push(publicUrlData.publicUrl);
          }
        } else {
          // If storage bucket is not configured, fallback to ObjectURL preview
          uploadedUrls.push(URL.createObjectURL(file));
        }
      } catch (err) {
        uploadedUrls.push(URL.createObjectURL(file));
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text && !selectedFiles.length) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const mediaUrls = await uploadMediaFiles();
      const { data: { user } } = await supabase.auth.getUser();

      const newPostObj = {
        id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        content: text,
        media_urls: mediaUrls,
        media_type: mediaType,
        created_at: new Date().toISOString(),
        likes_count: 0,
        profiles: {
          full_name: user?.user_metadata?.full_name || 'مستخدم Orbit',
          username: user?.user_metadata?.username || 'orbit_user',
          avatar_url: user?.user_metadata?.avatar_url || '',
          is_verified: user?.user_metadata?.username === 'l7v0l',
        },
      };

      if (user) {
        const { data, error } = await supabase
          .from('posts')
          .insert([
            {
              user_id: user.id,
              content: text,
              media_urls: mediaUrls,
              media_type: mediaType,
            },
          ])
          .select('*, profiles(full_name, username, avatar_url, is_verified, role)')
          .single();

        if (!error && data) {
          if (onPostCreated) onPostCreated(data);
        } else {
          if (onPostCreated) onPostCreated(newPostObj);
        }
      } else {
        if (onPostCreated) onPostCreated(newPostObj);
      }
    } catch (err) {
      console.error('Post submit error:', err);
    } finally {
      setContent('');
      setSelectedFiles([]);
      setPreviews([]);
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

        {/* Media Preview Grid */}
        {previews.length > 0 && (
          <div className="my-3 mr-13">
            {mediaType === 'video' ? (
              <div className="relative rounded-2xl overflow-hidden max-h-80 border border-slate-800">
                <video src={previews[0]} controls className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(0)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center font-bold text-xs hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-2 ${
                  previews.length === 1
                    ? 'grid-cols-1'
                    : previews.length === 2
                    ? 'grid-cols-2'
                    : previews.length === 3
                    ? 'grid-cols-2'
                    : 'grid-cols-2'
                }`}
              >
                {previews.map((url, idx) => (
                  <div key={idx} className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800">
                    <img src={url} alt={`upload-preview-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-950/80 text-white flex items-center justify-center font-bold text-xs hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl my-2">
            {errorMsg}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
          <div className="flex gap-1 text-slate-400">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-slate-800/80 rounded-xl text-blue-400 transition-colors flex items-center gap-1 text-xs font-semibold"
              title="إضافة صور (حتى 4) أو فيديو واحد"
            >
              <span>🖼️ / 🎬</span>
              <span className="hidden sm:inline">وسائط</span>
            </button>
            <button
              type="button"
              className="p-2 hover:bg-slate-800/80 rounded-xl text-purple-400 transition-colors text-xs"
              title="استطلاع رأي"
            >
              📊
            </button>
            <button
              type="button"
              className="p-2 hover:bg-slate-800/80 rounded-xl text-pink-400 transition-colors text-xs"
              title="رمز تعبيري"
            >
              😃
            </button>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && !selectedFiles.length) || loading}
            className="px-6 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 text-white rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'جاري الرفع والنشر...' : 'نشر المنشور'}
          </button>
        </div>
      </form>
    </div>
  );
}
