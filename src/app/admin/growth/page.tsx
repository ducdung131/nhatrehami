"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface GrowthRecord { id: string; studentId: string; date: string; height: number; weight: number; healthNote: string | null; teacherComment: string | null; student?: { fullName: string; className: string } }
interface Student { id: string; fullName: string; className: string }

export default function GrowthPage() {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentRecords, setSelectedStudentRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [form, setForm] = useState({ studentId: "", date: "", height: "", weight: "", healthNote: "", teacherComment: "" });

  useEffect(() => {
    Promise.all([fetch("/api/growth").then(r => r.json()), fetch("/api/students").then(r => r.json())])
      .then(([g, s]) => { if (!g.error) setRecords(g); if (!s.error) setStudents(s); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedStudent) {
      setSelectedStudentRecords([]);
      return;
    }
    fetch(`/api/growth?studentId=${selectedStudent}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setSelectedStudentRecords(data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        }
      })
      .catch(() => {});
  }, [selectedStudent]);

  const chartData = selectedStudentRecords.map(r => ({ date: new Date(r.date).toLocaleDateString("vi-VN", { month: "short" }), height: r.height, weight: r.weight }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentId || !form.date || !form.height || !form.weight) {
      toast.error("Vui lòng nhập đầy đủ");
      return;
    }
    try {
      const res = await fetch("/api/growth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.updated) {
          toast.success("Đã ghi đè & cập nhật chỉ số tháng này thành công!");
        } else {
          toast.success("Thêm chỉ số phát triển mới thành công!");
        }
        setShowModal(false);
        fetch("/api/growth").then((r) => r.json()).then(recordsData => {
          if (!recordsData.error) setRecords(recordsData);
        }).catch(() => {});
        if (form.studentId === selectedStudent) {
          fetch(`/api/growth?studentId=${selectedStudent}`)
            .then(r => r.json())
            .then(studentData => {
              if (!studentData.error) {
                setSelectedStudentRecords(studentData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()));
              }
            }).catch(() => {});
        }
      } else {
        toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Theo dõi phát triển</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Ghi nhận chiều cao, cân nặng và nhận xét</p>
        </div>
        <button onClick={() => { setForm({ studentId: "", date: "", height: "", weight: "", healthNote: "", teacherComment: "" }); setShowModal(true); }} className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 self-start"><Plus size={18} />Thêm bản ghi</button>
      </div>

      {/* Student selector */}
      <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm outline-none w-full max-w-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
        <option value="">Chọn học sinh để xem biểu đồ</option>
        {students.map(s => <option key={s.id} value={s.id}>{s.fullName} - {s.className}</option>)}
      </select>

      {/* Charts */}
      {selectedStudent && chartData.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Chiều cao (cm)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" /><XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--text-muted)" }} /><YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} /><Tooltip contentStyle={{ borderRadius: 12, background: "var(--bg-card)" }} /><Line type="monotone" dataKey="height" stroke="#FFB86C" strokeWidth={3} dot={{ fill: "#FFB86C", r: 5 }} /></LineChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <h3 className="text-lg font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Cân nặng (kg)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" /><XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--text-muted)" }} /><YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} /><Tooltip contentStyle={{ borderRadius: 12, background: "var(--bg-card)" }} /><Line type="monotone" dataKey="weight" stroke="#A8E6CF" strokeWidth={3} dot={{ fill: "#A8E6CF", r: 5 }} /></LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Records table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: "var(--bg-muted)" }}>
              {["Học sinh", "Lớp", "Ngày", "Chiều cao", "Cân nặng", "Ghi chú"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="p-8 text-center"><div className="skeleton h-6 w-32 mx-auto" /></td></tr> :
              records.slice(0, 20).map(r => (
                <tr key={r.id} className="border-t" style={{ borderColor: "var(--border-light)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>{r.student?.fullName || "-"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{r.student?.className || "-"}</td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{new Date(r.date).toLocaleDateString("vi-VN")}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "#FFB86C" }}>{r.height} cm</td>
                  <td className="px-4 py-3 font-medium" style={{ color: "#A8E6CF" }}>{r.weight} kg</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{r.healthNote || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Thêm bản ghi phát triển</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-black/5"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Học sinh</label><select value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}><option value="">Chọn học sinh</option>{students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Ngày</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Chiều cao (cm)</label><input type="number" step="0.1" value={form.height} onChange={e => setForm({...form, height: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} /></div>
                <div><label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Cân nặng (kg)</label><input type="number" step="0.1" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Ghi chú sức khỏe</label><textarea value={form.healthNote} onChange={e => setForm({...form, healthNote: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} /></div>
              <div><label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Nhận xét giáo viên</label><textarea value={form.teacherComment} onChange={e => setForm({...form, teacherComment: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} /></div>
              <button type="submit" className="w-full btn-primary !rounded-xl">Thêm bản ghi</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
