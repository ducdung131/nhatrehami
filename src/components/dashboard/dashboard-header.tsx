"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Menu, Sun, Moon, Bell } from "lucide-react";

export function DashboardHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <header className="sticky top-0 z-30 border-b px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" style={{ background: "var(--bg-card)", borderColor: "var(--border-light)" }}>
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5" aria-label="Menu">
        <Menu size={22} style={{ color: "var(--text-primary)" }} />
      </button>

      <div className="hidden lg:block">
        <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Quản lý Nhà Trẻ Hạ Mi</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="Notifications">
          <Bell size={20} style={{ color: "var(--text-secondary)" }} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
        </button>

        {mounted && (
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} style={{ color: "var(--text-secondary)" }} />}
          </button>
        )}

        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm ml-2">
          A
        </div>
      </div>
    </header>
  );
}
