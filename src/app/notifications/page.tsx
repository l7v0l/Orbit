'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Widgets from '@/components/layout/Widgets';
import { supabase } from '@/lib/supabase/client';

const mockNotifications = [
  {
    id: '1',
    type: 'like',
    user: 'سارة أحمد',
    username: 'sara_dev',
    avatar: '👩‍💻',
    action: 'أعجب بـمنشورك:',
    content: 'مرحباً بكم في شبكة Orbit! 🌌 المنصة تعمل الآن حقيقية ومباشرة...',
    time: 'منذ 5 دقائق',
  },
  {
    id: '2',
    type: 'follow',
    user: 'محمد علي',
    username: 'mohamed_dev',
    avatar: '👨‍💻',
    action: 'قام بمتابعتك الآن 🚀',
    content: '',
    time: 'منذ ساعتين',
  },
  {
    id: '3',
    type: 'repost',
    user: 'فريق Orbit الرسمي',
    username: 'orbit_team',
    avatar: '🚀',
    action: 'أعاد نشر تغريدتك في المنصة',
    content: 'تم تفعيل نظام توثيق الحسابات مع الإدارة الكاملة...',
    time: 'منذ 4 ساعات',
  },
];

export default function NotificationsPage() {
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserProfile({ id: user.id, ...(user.user_metadata || {}) });
      }
    };
    getProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between min-h-screen">
        {/* Sidebar */}
        <Sidebar userProfile={userProfile} />

        {/* Notifications Main Panel */}
        <main className="flex-1 border-r border-l border-slate-800 max-w-2xl min-h-screen pb-16">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-100">التنبيهات (Notifications)</h1>
              <p className="text-xs text-slate-400">آخر التفاعلات والمتابعات الخاصة بك</p>
            </div>
            <span className="text-xl">🔔</span>
          </header>

          {/* Notifications Feed List */}
          <div className="divide-y divide-slate-800/80">
            {mockNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 hover:bg-slate-900/40 transition-colors flex gap-4 items-start cursor-pointer"
              >
                <div className="text-2xl mt-1 shrink-0">
                  {notif.type === 'like' ? '❤️' : notif.type === 'follow' ? '👤' : '🔁'}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{notif.user}</span>
                    <span className="text-xs text-slate-500">@{notif.username}</span>
                    <span className="text-xs text-slate-500">• {notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-300 font-medium">{notif.action}</p>
                  {notif.content && (
                    <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 line-clamp-2 mt-2">
                      "{notif.content}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Widgets */}
        <Widgets />
      </div>
    </div>
  );
}
