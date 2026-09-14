import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const navItems = [
    { label: 'الرئيسية', href: '/', icon: '🏠' },
    { label: 'استكشف', href: '/explore', icon: '🔍' },
    { label: 'التنبيهات', href: '/notifications', icon: '🔔' },
    { label: 'الملف الشخصي', href: '/profile/me', icon: '👤' },
  ];

  return (
    <aside className="w-64 p-4 hidden lg:block border-l border-slate-800 min-h-screen">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition-all font-medium"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-105">
        انشر الآن 🚀
      </button>
    </aside>
  );
}
