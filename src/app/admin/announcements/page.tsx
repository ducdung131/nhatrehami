"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Trash2, Megaphone } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetClass: string | null;
  createdAt: string;
  createdBy?: { fullName: string };
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", targetClass: "" });

  const fetchData = () => {
    setLoading(true);
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setItems(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Vui lòng nhập đầy đủ");
      return;
    }
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Đã tạo thông báo!");
        setShowModal(false);
        fetchData();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Có lỗi xảy ra");
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thông báo này?")) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa thông báo thành công!");
        fetchData();
      } else {
        toast.error("Không thể xóa thông báo");
      }
    } catch {
      toast.error("Lỗi kết nối");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Thông báo</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Quản lý thông báo cho phụ huynh</p>
        </div>
        <button
          onClick={() => {
            setForm({ title: "", content: "", targetClass: "" });
            setShowModal(true);
          }}
          className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 self-start"
        >
          <Plus size={18} /> Tạo thông báo
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <Megaphone size={48} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Chưa có thông báo</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,184,108,0.1)" }}
                  >
                    <Megaphone size={22} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                        {item.title}
                      </h3>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 rounded-xl text-danger hover:bg-danger/10 transition-colors"
                        title="Xóa thông báo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                      {item.content}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                      {item.targetClass && (
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(168,230,207,0.2)",
                            color: "var(--color-secondary-dark)",
                          }}
                        >
                          {item.targetClass}
                        </span>
                      )}
                      {!item.targetClass && (
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{
                            background: "rgba(33,150,243,0.1)",
                            color: "var(--color-info)",
                          }}
                        >
                          Tất cả
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-6 w-full max-w-md"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
                Tạo thông báo
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-black/5">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Tiêu đề
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    background: "var(--bg-muted)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Tiêu đề thông báo..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Nội dung
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none focus:ring-2 focus:ring-primary/30"
                  style={{
                    background: "var(--bg-muted)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Nội dung thông báo..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
                  Đối tượng
                </label>
                <input
                  value={form.targetClass}
                  onChange={(e) => setForm({ ...form, targetClass: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{
                    background: "var(--bg-muted)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                  placeholder="Để trống = tất cả lớp"
                />
              </div>
              <button type="submit" className="w-full btn-primary !rounded-xl">
                Tạo thông báo
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
