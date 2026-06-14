"use client";

import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const heightData = [
  { month: "T1", value: 85 }, { month: "T2", value: 86 }, { month: "T3", value: 87.5 },
  { month: "T4", value: 88 }, { month: "T5", value: 89 }, { month: "T6", value: 90.5 },
  { month: "T7", value: 91 }, { month: "T8", value: 92 }, { month: "T9", value: 93 },
  { month: "T10", value: 94 }, { month: "T11", value: 95 }, { month: "T12", value: 96 },
];

const weightData = [
  { month: "T1", value: 12 }, { month: "T2", value: 12.3 }, { month: "T3", value: 12.5 },
  { month: "T4", value: 12.8 }, { month: "T5", value: 13 }, { month: "T6", value: 13.2 },
  { month: "T7", value: 13.5 }, { month: "T8", value: 13.8 }, { month: "T9", value: 14 },
  { month: "T10", value: 14.2 }, { month: "T11", value: 14.5 }, { month: "T12", value: 14.8 },
];

const attendanceData = [
  { month: "T1", rate: 92 }, { month: "T2", rate: 88 }, { month: "T3", rate: 95 },
  { month: "T4", rate: 90 }, { month: "T5", rate: 93 }, { month: "T6", rate: 96 },
  { month: "T7", rate: 85 }, { month: "T8", rate: 91 }, { month: "T9", rate: 94 },
  { month: "T10", rate: 97 }, { month: "T11", rate: 93 }, { month: "T12", rate: 95 },
];

export function StatsSection() {
  return (
    <section id="stats" className="py-20 lg:py-28" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: "rgba(33,150,243,0.1)", color: "var(--color-info)" }}>
            Thống kê
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-display)] mb-4" style={{ color: "var(--text-primary)" }}>
            Biểu đồ <span className="text-gradient">theo dõi</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Trực quan hóa dữ liệu phát triển của trẻ qua các biểu đồ đẹp mắt
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-6">
            <h3 className="text-lg font-bold mb-1 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Chiều cao trung bình</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Đơn vị: cm</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={heightData}>
                <defs>
                  <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB86C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#FFB86C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} domain={[80, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)" }} />
                <Area type="monotone" dataKey="value" stroke="#FFB86C" strokeWidth={3} fill="url(#hGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card p-6">
            <h3 className="text-lg font-bold mb-1 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Cân nặng trung bình</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Đơn vị: kg</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A8E6CF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#A8E6CF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} domain={[10, 16]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)" }} />
                <Area type="monotone" dataKey="value" stroke="#A8E6CF" strokeWidth={3} fill="url(#wGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="card p-6 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-1 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Tỷ lệ chuyên cần</h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Đơn vị: %</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} domain={[80, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border-color)", background: "var(--bg-card)" }} />
                <Bar dataKey="rate" fill="#2196F3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
