"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Edit2, Trash2, Eye, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

interface Student {
  id: string; fullName: string; avatar: string | null; birthDate: string;
  gender: string; className: string; address: string | null;
  parent?: { fullName: string; phone: string };
}

interface Parent { id: string; fullName: string; phone: string; }

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ fullName: "", birthDate: "", gender: "MALE", className: "", parentId: "", address: "", avatar: "" });

  const fetchData = async () => {
    try {
      const [sRes, pRes, tRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/parents"),
        fetch("/api/teachers")
      ]);
      const [sData, pData, tData] = await Promise.all([
        sRes.json(),
        pRes.json(),
        tRes.json()
      ]);
      if (!sData.error) setStudents(sData);
      if (!pData.error) setParents(pData);
      if (!tData.error) setTeachers(tData);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const classes = [...new Set(students.map((s) => s.className))].sort();
  const filtered = students.filter((s) => {
    const matchSearch = s.fullName.toLowerCase().includes(search.toLowerCase());
    const matchClass = !filterClass || s.className === filterClass;
    return matchSearch && matchClass;
  });

  const getTeacherForClass = (className: string) => {
    const teacher = teachers.find((t) => t.className === className);
    return teacher ? teacher.fullName : "Chưa phân công";
  };

  const openCreate = () => { setEditStudent(null); setForm({ fullName: "", birthDate: "", gender: "MALE", className: "", parentId: "", address: "", avatar: "" }); setShowModal(true); };
  const openEdit = (s: Student) => { setEditStudent(s); setForm({ fullName: s.fullName, birthDate: s.birthDate.slice(0, 10), gender: s.gender, className: s.className, parentId: "", address: s.address || "", avatar: s.avatar || "" }); setShowModal(true); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm(prev => ({ ...prev, avatar: data.url }));
        toast.success("Tải lên ảnh đại diện thành công!");
      } else {
        toast.error(data.error || "Không thể tải lên ảnh");
      }
    } catch {
      toast.error("Lỗi kết nối tải ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.birthDate || !form.className) { toast.error("Vui lòng nhập đầy đủ thông tin"); return; }
    try {
      const url = editStudent ? `/api/students/${editStudent.id}` : "/api/students";
      const method = editStudent ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { toast.success(editStudent ? "Cập nhật thành công!" : "Thêm học sinh thành công!"); setShowModal(false); fetchData(); }
      else toast.error("Có lỗi xảy ra");
    } catch { toast.error("Có lỗi xảy ra"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Đã xóa học sinh"); fetchData(); }
    } catch { toast.error("Có lỗi xảy ra"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Quản lý học sinh</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filtered.length} học sinh</p>
        </div>
        <button onClick={openCreate} className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 self-start">
          <Plus size={18} /> Thêm học sinh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm học sinh..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
        </div>
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
          <option value="">Tất cả lớp</option>
          {classes.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Student list */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Không tìm thấy học sinh</h3>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Thử thay đổi bộ lọc hoặc thêm học sinh mới</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.15) }} className="card p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                  {s.avatar ? <img src={s.avatar} alt="" className="w-full h-full object-cover" /> : getInitials(s.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate" style={{ color: "var(--text-primary)" }}>{s.fullName}</h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.className}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: s.gender === "MALE" ? "rgba(33,150,243,0.1)" : "rgba(233,30,99,0.1)", color: s.gender === "MALE" ? "#2196F3" : "#E91E63" }}>
                    {s.gender === "MALE" ? "Nam" : "Nữ"}
                  </span>
                </div>
              </div>
              {s.parent && (
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>PH: {s.parent.fullName} • {s.parent.phone}</p>
              )}
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                GV: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{getTeacherForClass(s.className)}</span>
              </p>
              <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "var(--border-light)" }}>
                <button onClick={() => openEdit(s)} className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors hover:bg-primary/10" style={{ color: "var(--color-primary)" }}>
                  <Edit2 size={14} /> Sửa
                </button>
                <button onClick={() => handleDelete(s.id)} className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors hover:bg-danger/10" style={{ color: "var(--color-danger)" }}>
                  <Trash2 size={14} /> Xóa
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ background: "var(--bg-card)" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
                {editStudent ? "Sửa học sinh" : "Thêm học sinh"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-black/5"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-3 pb-3 border-b" style={{ borderColor: "var(--border-light)" }}>
                <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-inner relative group">
                  {form.avatar ? (
                    <img src={form.avatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(form.fullName || "HS")
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <label className="btn-secondary !py-1.5 !px-4 text-xs inline-flex items-center gap-1.5 cursor-pointer">
                  <Upload size={12} />
                  {uploading ? "Đang tải lên..." : "Tải ảnh đại diện"}
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
                </label>
              </div>

              {[
                { label: "Họ tên", key: "fullName", type: "text", placeholder: "Nguyễn Văn A" },
                { label: "Ngày sinh", key: "birthDate", type: "date", placeholder: "" },
                { label: "Địa chỉ", key: "address", type: "text", placeholder: "Địa chỉ..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Lớp học</label>
                <select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="">Chọn lớp học</option>
                  <option value="Lớp Mầm">Lớp Mầm</option>
                  <option value="Lớp Chồi">Lớp Chồi</option>
                  <option value="Lớp Lá">Lớp Lá</option>
                  <option value="Lớp Búp">Lớp Búp</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Giới tính</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                </select>
              </div>
              {!editStudent && (
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Phụ huynh</label>
                  <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                    <option value="">Chọn phụ huynh</option>
                    {parents.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" className="w-full btn-primary !rounded-xl mt-2">
                {editStudent ? "Cập nhật" : "Thêm học sinh"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
