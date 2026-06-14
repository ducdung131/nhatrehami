"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "#about", label: "Giới thiệu" },
    { href: "#features", label: "Tính năng" },
    { href: "#stats", label: "Thống kê" },
    { href: "#contact", label: "Liên hệ" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg font-[var(--font-display)]">H</span>
            </div>
            <span className="text-xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
              Hạ Mi
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium hover:text-primary transition-colors" style={{ color: "var(--text-secondary)" }}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {mounted && (
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors" aria-label="Toggle theme">
                {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} style={{ color: "var(--text-secondary)" }} />}
              </button>
            )}
            <Link href="/login" className="hidden md:inline-flex btn-primary text-sm !py-2 !px-5 !rounded-xl">
              Đăng nhập
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl" aria-label="Menu">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass border-t" style={{ borderColor: "var(--border-color)" }}>
            <div className="px-4 py-4 space-y-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{l.label}</a>
              ))}
              <Link href="/login" className="block text-center btn-primary text-sm !py-2">Đăng nhập</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
