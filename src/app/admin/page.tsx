"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, BookOpen, CalendarCheck, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Stats {
  totalStudents: number;
  totalParents: number;
  totalClasses: number;
  averageAttendanceRate: number;
  studentsByClass: { name: string; value: number }[];
}

const COLORS = ["#FFB86C", "#A8E6CF", "#2196F3", "#E91E63", "#9C27B0", "#FF9800"];

// Demo data for when API is not connected
const demoStats: Stats = {
  totalStudents: 20, totalParents: 20, totalClasses: 4, averageAttendanceRate: 93,
  studentsByClass: [
    { name: "Lớp Mầm", value: 5 }, { name: "Lớp Chồi", value: 5 },
    { name: "Lớp Lá", value: 5 }, { name: "Lớp Búp", value: 5 },
  ],
};

const statCards = [
  { label: "Tổng học sinh", key: "totalStudents" as const, icon: Users, color: "#FFB86C", bg: "rgba(255,184,108,0.1)" },
  { label: "Tổng phụ huynh", key: "totalParents" as const, icon: UserCheck, color: "#A8E6CF", bg: "rgba(168,230,207,0.1)" },
  { label: "Tổng lớp học", key: "totalClasses" as const, icon: BookOpen, color: "#2196F3", bg: "rgba(33,150,243,0.1)" },
  { label: "Chuyên cần TB", key: "averageAttendanceRate" as const, icon: CalendarCheck, color: "#4CAF50", bg: "rgba(76,175,80,0.1)" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(demoStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((data) => {
      if (!data.error) setStats(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Tổng quan hệ thống quản lý nhà trẻ</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: card.bg }}>
                <card.icon size={24} style={{ color: card.color }} />
              </div>
              <TrendingUp size={16} style={{ color: card.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {loading ? <div className="skeleton h-8 w-16" /> : (card.key === "averageAttendanceRate" ? `${stats[card.key]}%` : stats[card.key])}
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
          <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Học sinh theo lớp</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.studentsByClass}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)" }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {stats.studentsByClass.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-6">
          <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Phân bố học sinh</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={stats.studentsByClass} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {stats.studentsByClass.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
