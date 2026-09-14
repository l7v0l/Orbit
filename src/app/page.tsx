import Logo from '@/components/ui/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="md" />
          
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
              تسجيل الدخول
            </button>
            <button className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-full shadow-lg shadow-purple-500/20 transition-all hover:scale-105">
              إنشاء حساب
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          مشروع منصة Orbit المباشر جاهز للتطوير
        </div>

        <div className="mb-8">
          <Logo size="xl" showText={false} className="mx-auto mb-4" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent mb-4">
            مرحباً بك في منصة Orbit
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            شبكة التواصل الاجتماعي والتدوين المصغر الحديثة المبنية بتقنيات Next.js (App Router), Supabase, و Tailwind CSS.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-right mt-8">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 font-bold text-xl">
              1
            </div>
            <h3 className="font-semibold text-lg text-slate-200 mb-2">قاعدة البيانات (SQL)</h3>
            <p className="text-sm text-slate-400">
              تم تجهيز جداول Users, Posts, Followers, Likes مع صلاحيات RLS ومحفز التلقائية.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 font-bold text-xl">
              2
            </div>
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Supabase Connection</h3>
            <p className="text-sm text-slate-400">
              تم إعداد الربط البرمجي عبر Client & Server Helpers في مجلد lib/supabase.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-pink-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 font-bold text-xl">
              3
            </div>
            <h3 className="font-semibold text-lg text-slate-200 mb-2">شعار Orbit</h3>
            <p className="text-sm text-slate-400">
              مكون Logo.jsx المصمم بـ SVG عالي الدقة مع التدرجات المدارية وجاهز للاستخدام.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        Orbit App Router • Developed with Next.js & Supabase
      </footer>
    </div>
  );
}
