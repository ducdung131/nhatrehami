"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Home, TrendingUp, MessageSquare, Bell, LogOut, Sun, Moon, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const handleLogout = async () => { const s = createClient(); await s.auth.signOut(); router.push("/login"); };

  const tabs = [
    { href: "/parent", icon: Home, label: "Tổng quan" },
    { href: "/parent/growth", icon: TrendingUp, label: "Phát triển" },
    { href: "/parent/comments", icon: MessageSquare, label: "Nhận xét" },
    { href: "/parent/notifications", icon: Bell, label: "Thông báo" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b px-4 sm:px-6 h-16 flex items-center justify-between" style={{ background: "var(--bg-card)", borderColor: "var(--border-light)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="sm:hidden p-2 rounded-xl" aria-label="Menu"><Menu size={22} /></button>
          <Link href="/parent" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"><span className="text-white font-bold text-sm">H</span></div>
            <span className="font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Hạ Mi</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {tabs.map(t => (
            <Link key={t.href} href={t.href} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${pathname === t.href ? "text-white shadow-md" : ""}`} style={pathname === t.href ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" } : { color: "var(--text-secondary)" }}>
              <t.icon size={16} />{t.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5" aria-label="Theme">{theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}</button>}
          <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-danger/10" style={{ color: "var(--color-danger)" }} aria-label="Logout"><LogOut size={18} /></button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileMenu && (
        <div className="sm:hidden border-b py-2 px-4 space-y-1" style={{ background: "var(--bg-card)", borderColor: "var(--border-light)" }}>
          {tabs.map(t => (
            <Link key={t.href} href={t.href} onClick={() => setMobileMenu(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${pathname === t.href ? "text-white" : ""}`} style={pathname === t.href ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" } : { color: "var(--text-secondary)" }}>
              {t.label}
            </Link>
          ))}
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
