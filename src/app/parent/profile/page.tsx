"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, CreditCard, UserPlus, Save, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ParentProfile {
  id: string;
  fullName: string;
  phone: string;
  citizenId: string | null;
  address: string | null;
  emergencyPhone: string | null;
}

export default function ParentProfilePage() {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    citizenId: "",
    address: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    fetch("/api/parents/profile")
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setProfile(data);
          setForm({
            phone: data.phone || "",
            citizenId: data.citizenId || "",
            address: data.address || "",
            emergencyPhone: data.emergencyPhone || "",
          });
        }
      })
      .catch(() => toast.error("Không thể tải thông tin"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim()) {
      toast.error("Số điện thoại không được để trống");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/parents/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setProfile(data);
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch {
      toast.error("Lỗi khi cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
          Không tìm thấy hồ sơ
        </h3>
        <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
          Vui lòng liên hệ nhà trường
        </p>
      </div>
    );
  }

  const fields = [
    {
      key: "phone" as const,
      label: "Số điện thoại",
      icon: Phone,
      placeholder: "Nhập số điện thoại...",
      color: "#FFB86C",
      required: true,
      type: "tel",
    },
    {
      key: "citizenId" as const,
      label: "Căn cước công dân",
      icon: CreditCard,
      placeholder: "Nhập số CCCD...",
      color: "#2196F3",
      required: false,
      type: "text",
    },
    {
      key: "address" as const,
      label: "Địa chỉ nhà",
      icon: MapPin,
      placeholder: "Nhập địa chỉ nhà...",
      color: "#4CAF50",
      required: false,
      type: "text",
    },
    {
      key: "emergencyPhone" as const,
      label: "SĐT người thân khác",
      icon: UserPlus,
      placeholder: "Nhập số điện thoại người thân...",
      color: "#E91E63",
      required: false,
      type: "tel",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
          Cập nhật hồ sơ 📋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Cập nhật thông tin danh tính của bạn
        </p>
      </div>

      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
            <User size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
              {profile.fullName}
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Phụ huynh
            </p>
          </div>
        </div>
      </motion.div>

      {/* Update Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="card p-6 space-y-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={20} style={{ color: "var(--color-primary)" }} />
          <h3 className="font-bold text-lg font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
            Thông tin danh tính
          </h3>
        </div>

        <div className="grid gap-5">
          {fields.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                <span className="inline-flex items-center gap-2">
                  <field.icon size={14} style={{ color: field.color }} />
                  {field.label}
                  {field.required && <span style={{ color: "var(--color-danger)" }}>*</span>}
                </span>
              </label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: "var(--bg-muted)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  // @ts-expect-error CSS variable
                  "--tw-ring-color": field.color,
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--border-light)" }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary !py-3 !px-6 text-sm inline-flex items-center gap-2 !rounded-xl disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu thay đổi
              </>
            )}
          </button>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            <CheckCircle size={12} className="inline mr-1" />
            Thông tin sẽ được bảo mật
          </p>
        </div>
      </motion.form>

      {/* Current info summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-6"
      >
        <h3 className="font-bold mb-4 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
          Thông tin hiện tại
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: "Số điện thoại", value: profile.phone, icon: Phone, color: "#FFB86C" },
            { label: "CCCD", value: profile.citizenId, icon: CreditCard, color: "#2196F3" },
            { label: "Địa chỉ", value: profile.address, icon: MapPin, color: "#4CAF50" },
            { label: "SĐT người thân", value: profile.emergencyPhone, icon: UserPlus, color: "#E91E63" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-muted)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}15` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{item.label}</p>
                <p className="text-sm font-medium" style={{ color: item.value ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {item.value || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
