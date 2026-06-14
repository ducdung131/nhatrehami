"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Check, X as XIcon, Clock } from "lucide-react";
import { toast } from "sonner";

interface Student { id: string; fullName: string; className: string }
interface Attendance { id: string; studentId: string; date: string; status: string; student?: { fullName: string } }

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterClass, setFilterClass] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([fetch("/api/students").then(r => r.json()), fetch("/api/attendance").then(r => r.json())])
      .then(([s, a]) => { if (!s.error) setStudents(s); if (!a.error) setAttendances(a); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const classes = [...new Set(students.map(s => s.className))].sort();
  const filtered = students.filter(s => !filterClass || s.className === filterClass);
  const todayAttendance = attendances.filter(a => a.date.slice(0, 10) === selectedDate);

  const getStatus = (studentId: string) => {
    if (statusMap[studentId]) return statusMap[studentId];
    const existing = todayAttendance.find(a => a.studentId === studentId);
    return existing?.status || "";
  };

  const setStatus = (studentId: string, status: string) => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    const entries = Object.entries(statusMap);
    if (entries.length === 0) { toast.error("Chưa có thay đổi nào"); return; }
    try {
      const data = entries.map(([studentId, status]) => ({ studentId, date: selectedDate, status }));
      const res = await fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (res.ok) { toast.success("Lưu điểm danh thành công!"); setStatusMap({}); const a = await fetch("/api/attendance").then(r => r.json()); if (!a.error) setAttendances(a); }
    } catch { toast.error("Có lỗi xảy ra"); }
  };

  const statusColors: Record<string, { bg: string; color: string; icon: typeof Check }> = {
    PRESENT: { bg: "rgba(76,175,80,0.1)", color: "#4CAF50", icon: Check },
    ABSENT: { bg: "rgba(244,67,54,0.1)", color: "#F44336", icon: XIcon },
    LATE: { bg: "rgba(255,152,0,0.1)", color: "#FF9800", icon: Clock },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Điểm danh</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Quản lý điểm danh hàng ngày</p>
        </div>
        <button onClick={handleSave} className="btn-primary !py-2.5 !px-5 text-sm self-start">Lưu điểm danh</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
          <option value="">Tất cả lớp</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ background: "var(--bg-muted)" }}>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>Học sinh</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>Lớp</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: "var(--text-secondary)" }}>Có mặt</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: "var(--text-secondary)" }}>Vắng</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: "var(--text-secondary)" }}>Đi trễ</th>
              </tr></thead>
              <tbody>
                {filtered.map(s => {
                  const currentStatus = getStatus(s.id);
                  return (
                    <tr key={s.id} className="border-t" style={{ borderColor: "var(--border-light)" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{s.fullName}</td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{s.className}</td>
                      {(["PRESENT", "ABSENT", "LATE"] as const).map(status => (
                        <td key={status} className="px-4 py-3 text-center">
                          <button onClick={() => setStatus(s.id, status)} className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all ${currentStatus === status ? "shadow-md scale-110" : "hover:scale-105"}`} style={{ background: currentStatus === status ? statusColors[status].bg : "transparent", border: `2px solid ${currentStatus === status ? statusColors[status].color : "var(--border-color)"}` }}>
                            {(() => { const Icon = statusColors[status].icon; return <Icon size={18} style={{ color: currentStatus === status ? statusColors[status].color : "var(--text-muted)" }} />; })()}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
