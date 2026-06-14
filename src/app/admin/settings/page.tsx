"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Cài đặt</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Quản lý cài đặt hệ thống</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette size={22} className="text-primary" />
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Giao diện</h3>
          </div>
          {mounted && (
            <div className="flex gap-3">
              {[
                { value: "light", label: "Sáng", emoji: "☀️" },
                { value: "dark", label: "Tối", emoji: "🌙" },
                { value: "system", label: "Hệ thống", emoji: "💻" },
              ].map(opt => (
                <button key={opt.value} onClick={() => setTheme(opt.value)} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all ${theme === opt.value ? "shadow-md" : ""}`} style={{ borderColor: theme === opt.value ? "var(--color-primary)" : "var(--border-color)", background: theme === opt.value ? "rgba(255,184,108,0.1)" : "var(--bg-muted)", color: "var(--text-primary)" }}>
                  <div className="text-lg mb-1">{opt.emoji}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={22} className="text-secondary-dark" />
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Bảo mật</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Quản lý mật khẩu và bảo mật tài khoản</p>
          <button className="btn-secondary !py-2 !px-4 text-sm !rounded-xl">Đổi mật khẩu</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={22} className="text-warning" />
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Thông báo</h3>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Cấu hình nhận thông báo qua email và trong ứng dụng</p>
        </motion.div>
      </div>
    </div>
  );
}
