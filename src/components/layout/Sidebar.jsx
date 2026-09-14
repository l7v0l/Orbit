'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase/client';

export default function Sidebar({ userProfile }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { label: 'الرئيسية', href: '/home', icon: '🏠' },
    { label: 'استكشف', href: '/explore', icon: '🔍' },
    { label: 'التنبيهات', href: '/notifications', icon: '🔔' },
    { label: 'المفضلة', href: '/bookmarks', icon: '🔖' },
    { label: 'الملف الشخصي', href: '/profile', icon: '👤' },
  ];

  const isAdmin = userProfile?.role === 'admin' || userProfile?.username === 'l7v0l';

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="w-16 md:w-64 p-2 md:p-4 flex flex-col justify-between h-screen sticky top-0 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md z-30 shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-1 md:px-3 pt-2 flex justify-center md:justify-start">
            <Link href="/home">
              <Logo size="md" showText={false} className="block md:hidden" />
              <Logo size="md" showText={true} className="hidden md:flex" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center md:justify-start gap-4 px-3 md:px-4 py-3 rounded-2xl font-semibold transition-all text-base ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Link */}
            {isAdmin && (
              <Link
                href="/admin"
                className={`flex items-center justify-center md:justify-start gap-4 px-3 md:px-4 py-3 rounded-2xl font-semibold transition-all text-base text-amber-400 hover:bg-amber-500/10 ${
                  pathname === '/admin' ? 'bg-amber-500/20 border border-amber-500/30' : ''
                }`}
              >
                <span className="text-xl">👑</span>
                <span className="hidden md:inline">الإدارة العامـة</span>
              </Link>
            )}
          </nav>

          {/* Tweet Button */}
          <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center">
            <span className="hidden md:inline">انشر في Orbit 🚀</span>
            <span className="md:hidden text-lg">🚀</span>
          </button>
        </div>

        {/* User Profile & Logout */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          {userProfile && (
            <div className="px-2 md:px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                {userProfile.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden hidden md:block">
                <h4 className="font-semibold text-slate-200 text-xs truncate">
                  {userProfile.full_name || 'مستخدم Orbit'}
                </h4>
                <span className="text-[10px] text-slate-400 block truncate dir-ltr">
                  @{userProfile.username || 'orbit_user'}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl font-medium transition-all text-sm"
            title="تسجيل الخروج"
          >
            <span className="text-lg">🚪</span>
            <span className="hidden md:inline">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg flex items-center justify-around z-50 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2.5 rounded-xl text-xl ${
                isActive ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400'
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
        {isAdmin && (
          <Link href="/admin" className="p-2.5 text-amber-400 text-xl" title="الإدارة">
            👑
          </Link>
        )}
        <button onClick={handleLogout} className="p-2.5 text-red-400 text-xl" title="تسجيل الخروج">
          🚪
        </button>
      </div>
    </>
  );
}
