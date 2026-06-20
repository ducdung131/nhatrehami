"use client";

import { useEffect, useState } from "react";
import { Phone, Mail, Users, Plus, X, Trash2, GraduationCap, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

interface Teacher {
  id: string;
  fullName: string;
  phone: string;
  className: string;
  user?: { email: string; isActive: boolean };
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "", className: "Lớp Mầm" });
  const [creating, setCreating] = useState(false);

  const fetchTeachers = () => {
    setLoading(true);
    fetch("/api/teachers")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setTeachers(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filtered = teachers.filter((t) =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.className.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditTeacher(null);
    setForm({ fullName: "", phone: "", email: "", password: "", className: "Lớp Mầm" });
    setShowModal(true);
  };

  const openEdit = (t: Teacher) => {
    setEditTeacher(t);
    setForm({
      fullName: t.fullName,
      phone: t.phone,
      email: t.user?.email || "",
      password: "",
      className: t.className
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTeacher) {
      if (!form.fullName || !form.phone || !form.className) {
        toast.error("Vui lòng điền đầy đủ các trường");
        return;
      }
    } else {
      if (!form.fullName || !form.phone || !form.email || !form.password || !form.className) {
        toast.error("Vui lòng điền đầy đủ các trường");
        return;
      }
    }
    
    setCreating(true);
    try {
      const url = editTeacher ? `/api/teachers/${editTeacher.id}` : "/api/teachers";
      const method = editTeacher ? "PUT" : "POST";
      const body = editTeacher 
        ? { fullName: form.fullName, phone: form.phone, className: form.className }
        : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editTeacher ? "Cập nhật thông tin giáo viên thành công!" : "Tạo tài khoản giáo viên thành công!");
        setShowModal(false);
        fetchTeachers();
      } else {
        toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Lỗi hệ thống");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Bạn có chắc muốn xóa giáo viên này? Thao tác này sẽ xóa vĩnh viễn tài khoản cùng tất cả dữ liệu liên quan!"
      )
    )
      return;
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Đã xóa giáo viên thành công!");
        fetchTeachers();
      } else {
        toast.error(data.error || "Không thể xóa giáo viên");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Quản lý giáo viên</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filtered.length} giáo viên</p>
        </div>
        <button onClick={openCreate} className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 self-start">
          <Plus size={18} /> Thêm giáo viên
        </button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm giáo viên, lớp phụ trách..." className="w-full max-w-md px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="skeleton h-44 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center"><div className="text-4xl mb-3">📭</div><h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Không tìm thấy giáo viên</h3></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.15) }} className="card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center font-bold text-lg flex-shrink-0 text-white">
                      {getInitials(t.fullName)}
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>{t.fullName}</h3>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}><Phone size={12} />{t.phone}</div>
                    </div>
                  </div>
                </div>
                {t.user && <div className="flex items-center gap-1 text-xs mb-2" style={{ color: "var(--text-secondary)" }}><Mail size={12} />{t.user.email}</div>}
              </div>

              <div className="pt-3 border-t space-y-3 mt-3" style={{ borderColor: "var(--border-light)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}><GraduationCap size={14} />Lớp phụ trách:</div>
                  <div className="text-xs px-2.5 py-1 rounded-full font-semibold bg-secondary/20 text-secondary-dark">{t.className}</div>
                </div>
                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: "var(--border-light)" }}>
                  <button onClick={() => openEdit(t)} className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors hover:bg-primary/10" style={{ color: "var(--color-primary)" }}>
                    <Edit2 size={14} /> Sửa
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors hover:bg-danger/10" style={{ color: "var(--color-danger)" }}>
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
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
                {editTeacher ? "Sửa thông tin giáo viên" : "Thêm giáo viên"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-black/5"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Họ và tên</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nguyễn Thị B" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Số điện thoại</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0987654322" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Lớp phụ trách</label>
                <select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="Lớp Mầm">Lớp Mầm</option>
                  <option value="Lớp Chồi">Lớp Chồi</option>
                  <option value="Lớp Lá">Lớp Lá</option>
                  <option value="Lớp Búp">Lớp Búp</option>
                </select>
              </div>
              {!editTeacher && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Email đăng nhập</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="teacher@gmail.com" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Mật khẩu</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                  </div>
                </>
              )}
              <button type="submit" disabled={creating} className="w-full btn-primary !rounded-xl mt-2 flex items-center justify-center gap-2">
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  editTeacher ? "Cập nhật" : "Tạo giáo viên"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
