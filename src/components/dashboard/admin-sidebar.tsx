"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, UserCheck, TrendingUp, CalendarCheck,
  Megaphone, BarChart3, Settings, X, LogOut, GraduationCap, DollarSign
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/students", icon: Users, label: "Học sinh" },
  { href: "/admin/parents", icon: UserCheck, label: "Phụ huynh" },
  { href: "/admin/teachers", icon: GraduationCap, label: "Giáo viên" },
  { href: "/admin/growth", icon: TrendingUp, label: "Phát triển" },
  { href: "/admin/attendance", icon: CalendarCheck, label: "Điểm danh" },
  { href: "/admin/announcements", icon: Megaphone, label: "Thông báo" },
  { href: "/admin/tuition", icon: DollarSign, label: "Học phí" },
  { href: "/admin/reports", icon: BarChart3, label: "Báo cáo" },
  { href: "/admin/settings", icon: Settings, label: "Cài đặt" },
];

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const sidebar = (
    <div className="h-full flex flex-col py-6" style={{ background: "var(--bg-sidebar)" }}>
      {/* Logo */}
      <div className="px-6 mb-8">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h2 className="text-lg font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Hạ Mi</h2>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Quản lý nhà trẻ</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${isActive ? "text-white shadow-md" : "hover:bg-black/5 dark:hover:bg-white/5"}`} style={isActive ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" } : { color: "var(--text-secondary)" }}>
              <item.icon size={20} />
              {item.label}
              {isActive && <motion.div layoutId="activeTab" className="absolute inset-0 rounded-xl" style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", zIndex: -1 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 mt-4">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full transition-all hover:bg-danger/10" style={{ color: "var(--color-danger)" }}>
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-72 border-r z-40" style={{ borderColor: "var(--border-light)", background: "var(--bg-sidebar)" }}>
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", damping: 25 }} className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden border-r" style={{ borderColor: "var(--border-light)", background: "var(--bg-sidebar)" }}>
              <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-black/5" aria-label="Close">
                <X size={20} style={{ color: "var(--text-secondary)" }} />
              </button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
