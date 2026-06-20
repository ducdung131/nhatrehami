"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Users, Plus, X, Trash2 } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

interface Parent {
  id: string;
  fullName: string;
  phone: string;
  user?: { email: string; isActive: boolean };
  students?: { id: string; fullName: string; className: string }[];
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", password: "" });
  const [creating, setCreating] = useState(false);

  const fetchParents = () => {
    setLoading(true);
    fetch("/api/parents")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setParents(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const filtered = parents.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.email || !form.password) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Tạo tài khoản phụ huynh thành công!");
        setShowModal(false);
        setForm({ fullName: "", phone: "", email: "", password: "" });
        fetchParents();
      } else {
        toast.error(data.error || "Không thể tạo phụ huynh");
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
        "Bạn có chắc muốn xóa phụ huynh này? Thao tác này sẽ xóa vĩnh viễn tài khoản phụ huynh cùng tất cả dữ liệu học sinh liên quan!"
      )
    )
      return;
    try {
      const res = await fetch(`/api/parents/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Đã xóa phụ huynh thành công!");
        fetchParents();
      } else {
        toast.error(data.error || "Không thể xóa phụ huynh");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Quản lý phụ huynh</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filtered.length} phụ huynh</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 self-start">
          <Plus size={18} /> Thêm phụ huynh
        </button>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm phụ huynh..." className="w-full max-w-md px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-44 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center"><div className="text-4xl mb-3">📭</div><h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Không tìm thấy phụ huynh</h3></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.015, 0.15) }} className="card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl gradient-secondary flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ color: "#333" }}>
                      {getInitials(p.fullName)}
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>{p.fullName}</h3>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}><Phone size={12} />{p.phone}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl text-danger hover:bg-danger/10 transition-colors" title="Xóa phụ huynh">
                    <Trash2 size={16} />
                  </button>
                </div>
                {p.user && <div className="flex items-center gap-1 text-xs mb-2" style={{ color: "var(--text-secondary)" }}><Mail size={12} />{p.user.email}</div>}
              </div>

              {p.students && p.students.length > 0 && (
                <div className="pt-3 border-t space-y-1 mt-3" style={{ borderColor: "var(--border-light)" }}>
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}><Users size={12} />Con em:</div>
                  {p.students.map(s => (
                    <div key={s.id} className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--bg-muted)", color: "var(--text-secondary)" }}>{s.fullName} - {s.className}</div>
                  ))}
                </div>
              )}
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
                Thêm phụ huynh
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-black/5"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Họ và tên</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Số điện thoại</label>
                <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0987654321" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Email đăng nhập</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="parent@gmail.com" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Mật khẩu</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>
              <button type="submit" disabled={creating} className="w-full btn-primary !rounded-xl mt-2 flex items-center justify-center gap-2">
                {creating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "Tạo phụ huynh"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
