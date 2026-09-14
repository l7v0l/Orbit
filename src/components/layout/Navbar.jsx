import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo size="md" />
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8">
          <input
            type="text"
            placeholder="ابحث في Orbit..."
            className="w-full bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </header>
  );
}
