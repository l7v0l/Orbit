'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase/client';

export default function Sidebar() {
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
    { label: 'الملف الشخصي', href: '/profile', icon: '👤' },
  ];

  return (
    <aside className="w-64 p-4 hidden md:flex flex-col justify-between h-screen sticky top-0 border-l border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <div className="space-y-6">
        {/* Logo */}
        <div className="px-3 pt-2">
          <Link href="/home">
            <Logo size="md" />
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
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold transition-all text-base ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
          انشر في Orbit 🚀
        </button>
      </div>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl font-medium transition-all text-sm"
        >
          <span className="text-lg">🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
