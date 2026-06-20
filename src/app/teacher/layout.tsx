"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Home, TrendingUp, CalendarCheck, LogOut, Sun, Moon, Menu, X, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.role !== "TEACHER") {
          router.push("/login");
        } else {
          setTeacherName(data.fullName);
          setClassName(data.teacher?.className || "");
        }
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    const s = createClient();
    await s.auth.signOut();
    window.location.replace("/login");
  };

  const tabs = [
    { href: "/teacher", icon: Home, label: "Tổng quan" },
    { href: "/teacher/attendance", icon: CalendarCheck, label: "Điểm danh" },
    { href: "/teacher/growth", icon: TrendingUp, label: "Phát triển" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b px-4 sm:px-6 h-16 flex items-center justify-between" style={{ background: "var(--bg-card)", borderColor: "var(--border-light)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="sm:hidden p-2 rounded-xl" aria-label="Menu"><Menu size={22} /></button>
          <Link href="/teacher" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"><span className="text-white font-bold text-sm">H</span></div>
            <span className="font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Hạ Mi • Giáo viên</span>
          </Link>
          {className && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary-dark ml-2">
              <GraduationCap size={12} /> Lớp {className}
            </span>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {tabs.map(t => {
            const isActive = pathname === t.href;
            return (
              <Link key={t.href} href={t.href} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${isActive ? "text-white shadow-md" : ""}`} style={isActive ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" } : { color: "var(--text-secondary)" }}>
                <t.icon size={16} />{t.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-medium mr-2" style={{ color: "var(--text-muted)" }}>Cô {teacherName}</span>
          {mounted && <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5" aria-label="Theme">{theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}</button>}
          <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-danger/10" style={{ color: "var(--color-danger)" }} aria-label="Logout"><LogOut size={18} /></button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileMenu && (
        <div className="sm:hidden border-b py-2 px-4 space-y-1" style={{ background: "var(--bg-card)", borderColor: "var(--border-light)" }}>
          {tabs.map(t => {
            const isActive = pathname === t.href;
            return (
              <Link key={t.href} href={t.href} onClick={() => setMobileMenu(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive ? "text-white" : ""}`} style={isActive ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" } : { color: "var(--text-secondary)" }}>
                {t.label}
              </Link>
            );
          })}
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
