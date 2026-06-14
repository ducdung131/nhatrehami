"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function ParentGrowthPage() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(data => {
      if (data.parent?.students) {
        Promise.all(data.parent.students.map((s: any) => fetch(`/api/students/${s.id}`).then(r => r.json()))).then(kids => { setChildren(kids); if (kids.length > 0) setSelectedChild(kids[0].id); });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const child = children.find(c => c.id === selectedChild);
  const records = child?.growthRecords?.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  const chartData = records.map((r: any) => ({ date: new Date(r.date).toLocaleDateString("vi-VN", { month: "short", year: "2-digit" }), height: r.height, weight: r.weight }));

  const attendances = child?.attendances || [];
  const present = attendances.filter((a: any) => a.status === "PRESENT").length;
  const absent = attendances.filter((a: any) => a.status === "ABSENT").length;
  const late = attendances.filter((a: any) => a.status === "LATE").length;
  const pieData = [{ name: "Có mặt", value: present }, { name: "Vắng", value: absent }, { name: "Đi trễ", value: late }].filter(d => d.value > 0);

  if (loading) return <div className="space-y-4">{[1,2].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Biểu đồ phát triển</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Theo dõi chiều cao, cân nặng và chuyên cần</p>
      </div>

      {children.length > 1 && (
        <select value={selectedChild} onChange={e => setSelectedChild(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
          {children.map((c: any) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
        </select>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>📏 Chiều cao (cm)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} /><YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} /><Tooltip contentStyle={{ borderRadius: 12, background: "var(--bg-card)" }} /><Line type="monotone" dataKey="height" stroke="#FFB86C" strokeWidth={3} dot={{ fill: "#FFB86C", r: 5 }} /></LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>Chưa có dữ liệu</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>⚖️ Cân nặng (kg)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" /><XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-muted)" }} /><YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} /><Tooltip contentStyle={{ borderRadius: 12, background: "var(--bg-card)" }} /><Line type="monotone" dataKey="weight" stroke="#A8E6CF" strokeWidth={3} dot={{ fill: "#A8E6CF", r: 5 }} /></LineChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>Chưa có dữ liệu</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>📊 Tỷ lệ chuyên cần</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#4CAF50" /><Cell fill="#F44336" /><Cell fill="#FF9800" />
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>Chưa có dữ liệu</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>📈 Tăng trưởng</h3>
          {chartData.length >= 2 ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(255,184,108,0.1)" }}>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Chiều cao tăng</span>
                <span className="font-bold" style={{ color: "#FFB86C" }}>+{(chartData[chartData.length-1].height - chartData[0].height).toFixed(1)} cm</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "rgba(168,230,207,0.1)" }}>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Cân nặng tăng</span>
                <span className="font-bold" style={{ color: "#7DD4B0" }}>+{(chartData[chartData.length-1].weight - chartData[0].weight).toFixed(1)} kg</span>
              </div>
            </div>
          ) : <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>Cần ít nhất 2 bản ghi</p>}
        </motion.div>
      </div>
    </div>
  );
}
