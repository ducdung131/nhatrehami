"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign, Calculator, Plus, Save, Trash2, ChevronDown,
  CalendarDays, Users, FileText, Loader2, Printer
} from "lucide-react";
import { toast } from "sonner";

interface TuitionRate {
  id: string;
  className: string;
  dailyRate: number;
  monthlyFee: number;
  note: string | null;
}

interface TuitionCalc {
  studentId: string;
  studentName: string;
  className: string;
  parentName: string;
  parentPhone: string;
  month: string;
  presentDays: number;
  absentDays: number;
  totalDays: number;
  dailyRate: number;
  dailyFee: number;
  monthlyFee: number;
  totalFee: number;
  rateName: string;
}

export default function TuitionPage() {
  const [tab, setTab] = useState<"rates" | "calculate">("rates");
  const [rates, setRates] = useState<TuitionRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Rate form
  const [showForm, setShowForm] = useState(false);
  const [rateForm, setRateForm] = useState({ className: "", dailyRate: "", monthlyFee: "0", note: "" });

  // Calculation
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [filterClass, setFilterClass] = useState("");
  const [calcResults, setCalcResults] = useState<TuitionCalc[]>([]);
  const [calcLoading, setCalcLoading] = useState(false);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const res = await fetch("/api/tuition");
      const data = await res.json();
      if (!data.error) setRates(data);
    } catch {
      toast.error("Không thể tải mức học phí");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rateForm.className || !rateForm.dailyRate) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/tuition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rateForm),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Đã lưu mức học phí!");
        setShowForm(false);
        setRateForm({ className: "", dailyRate: "", monthlyFee: "0", note: "" });
        fetchRates();
      }
    } catch {
      toast.error("Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (!confirm("Xác nhận xóa mức học phí này?")) return;
    try {
      await fetch(`/api/tuition?id=${id}`, { method: "DELETE" });
      toast.success("Đã xóa");
      fetchRates();
    } catch {
      toast.error("Lỗi khi xóa");
    }
  };

  const handleCalculate = async () => {
    setCalcLoading(true);
    try {
      const params = new URLSearchParams({ month });
      if (filterClass) params.set("className", filterClass);
      const res = await fetch(`/api/tuition/calculate?${params}`);
      const data = await res.json();
      if (!data.error) {
        setCalcResults(data);
        if (data.length === 0) toast.info("Không có dữ liệu cho tháng này");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Lỗi khi tính học phí");
    } finally {
      setCalcLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const totalAllFees = calcResults.reduce((sum, r) => sum + r.totalFee, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
          Học phí 💰
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Quản lý mức học phí và tính học phí theo điểm danh
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "rates" as const, label: "Mức học phí", icon: DollarSign },
          { key: "calculate" as const, label: "Tính học phí", icon: Calculator },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
            style={tab === t.key
              ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))", color: "white", boxShadow: "0 4px 15px rgba(255,184,108,0.3)" }
              : { background: "var(--bg-muted)", color: "var(--text-secondary)" }
            }
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Rates Tab */}
      {tab === "rates" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Danh sách mức học phí</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary !py-2 !px-4 text-sm inline-flex items-center gap-2 !rounded-xl"
            >
              <Plus size={16} />
              Thêm / Sửa
            </button>
          </div>

          {/* Add/Edit Form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveRate}
                className="card p-5 space-y-4 overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Tên lớp</label>
                    <input
                      type="text"
                      value={rateForm.className}
                      onChange={e => setRateForm(p => ({ ...p, className: e.target.value }))}
                      placeholder="VD: Lớp Mầm, Lớp Chồi..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Học phí / ngày (VNĐ)</label>
                    <input
                      type="number"
                      value={rateForm.dailyRate}
                      onChange={e => setRateForm(p => ({ ...p, dailyRate: e.target.value }))}
                      placeholder="VD: 50000"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Phí cố định / tháng (VNĐ)</label>
                    <input
                      type="number"
                      value={rateForm.monthlyFee}
                      onChange={e => setRateForm(p => ({ ...p, monthlyFee: e.target.value }))}
                      placeholder="VD: 200000"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Ghi chú</label>
                    <input
                      type="text"
                      value={rateForm.note}
                      onChange={e => setRateForm(p => ({ ...p, note: e.target.value }))}
                      placeholder="Ghi chú thêm..."
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 !rounded-xl"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Lưu mức học phí
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Rate List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
            </div>
          ) : rates.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Chưa có mức học phí</h3>
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Thêm mức học phí cho từng lớp</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rates.map((rate, i) => (
                <motion.div
                  key={rate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,184,108,0.1)" }}>
                        <DollarSign size={20} style={{ color: "#FFB86C" }} />
                      </div>
                      <h4 className="font-bold" style={{ color: "var(--text-primary)" }}>{rate.className}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteRate(rate.id)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={16} style={{ color: "var(--color-danger)" }} />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Học phí / ngày:</span>
                      <span className="font-bold" style={{ color: "#FFB86C" }}>{formatCurrency(rate.dailyRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-muted)" }}>Phí cố định / tháng:</span>
                      <span className="font-bold" style={{ color: "#A8E6CF" }}>{formatCurrency(rate.monthlyFee)}</span>
                    </div>
                    {rate.note && (
                      <p className="text-xs pt-2 border-t" style={{ color: "var(--text-muted)", borderColor: "var(--border-light)" }}>
                        📝 {rate.note}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Calculate Tab */}
      {tab === "calculate" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold mb-4" style={{ color: "var(--text-primary)" }}>Tính học phí theo tháng</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} style={{ color: "var(--text-muted)" }} />
                <input
                  type="month"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                />
              </div>
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
              >
                <option value="">Tất cả lớp</option>
                {rates.map(r => (
                  <option key={r.id} value={r.className}>{r.className}</option>
                ))}
              </select>
              <button
                onClick={handleCalculate}
                disabled={calcLoading}
                className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 !rounded-xl"
              >
                {calcLoading ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
                Tính học phí
              </button>
              {calcResults.length > 0 && (
                <button
                  onClick={() => window.print()}
                  className="btn-secondary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 !rounded-xl"
                >
                  <Printer size={16} />
                  In bảng
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {calcResults.length > 0 && (
            <div className="space-y-4">
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                  <Users size={20} className="mx-auto mb-2" style={{ color: "#FFB86C" }} />
                  <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{calcResults.length}</div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Học sinh</p>
                </div>
                <div className="card p-4 text-center">
                  <CalendarDays size={20} className="mx-auto mb-2" style={{ color: "#4CAF50" }} />
                  <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {Math.round(calcResults.reduce((s, r) => s + r.presentDays, 0) / calcResults.length)}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ngày TB đi học</p>
                </div>
                <div className="card p-4 text-center">
                  <DollarSign size={20} className="mx-auto mb-2" style={{ color: "#2196F3" }} />
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {formatCurrency(calcResults.length > 0 ? totalAllFees / calcResults.length : 0)}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Học phí TB</p>
                </div>
                <div className="card p-4 text-center">
                  <FileText size={20} className="mx-auto mb-2" style={{ color: "#E91E63" }} />
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {formatCurrency(totalAllFees)}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Tổng học phí</p>
                </div>
              </div>

              {/* Printable table */}
              <div className="print-area card p-5 overflow-x-auto">
                {/* Print header */}
                <div className="hidden print:block text-center mb-6 border-b-2 pb-4" style={{ borderColor: "#FFB86C" }}>
                  <h2 className="text-2xl font-bold">TRƯỜNG MẦM NON HẠ MI</h2>
                  <p className="text-sm text-gray-600">Đường Trì Bình - Dung Quất, Bình Sơn, Quảng Ngãi</p>
                  <h1 className="text-xl font-bold mt-4 uppercase">Bảng Học Phí Tháng {month}</h1>
                </div>

                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: "var(--bg-muted)" }}>
                      <th className="p-3 text-left rounded-tl-xl font-semibold" style={{ color: "var(--text-secondary)" }}>STT</th>
                      <th className="p-3 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>Họ tên</th>
                      <th className="p-3 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>Lớp</th>
                      <th className="p-3 text-center font-semibold" style={{ color: "var(--text-secondary)" }}>Ngày đi</th>
                      <th className="p-3 text-center font-semibold" style={{ color: "var(--text-secondary)" }}>Nghỉ</th>
                      <th className="p-3 text-right font-semibold" style={{ color: "var(--text-secondary)" }}>HP/ngày</th>
                      <th className="p-3 text-right font-semibold" style={{ color: "var(--text-secondary)" }}>HP điểm danh</th>
                      <th className="p-3 text-right font-semibold" style={{ color: "var(--text-secondary)" }}>Phí CĐ</th>
                      <th className="p-3 text-right rounded-tr-xl font-semibold" style={{ color: "var(--text-secondary)" }}>Tổng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calcResults.map((r, i) => (
                      <tr
                        key={r.studentId}
                        className="transition-colors"
                        style={{ borderBottom: "1px solid var(--border-light)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg-muted)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td className="p-3" style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                        <td className="p-3 font-medium" style={{ color: "var(--text-primary)" }}>{r.studentName}</td>
                        <td className="p-3" style={{ color: "var(--text-secondary)" }}>{r.className}</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold" style={{ background: "rgba(76,175,80,0.1)", color: "#4CAF50" }}>
                            {r.presentDays}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold" style={{ background: "rgba(244,67,54,0.1)", color: "#F44336" }}>
                            {r.absentDays}
                          </span>
                        </td>
                        <td className="p-3 text-right" style={{ color: "var(--text-secondary)" }}>{formatCurrency(r.dailyRate)}</td>
                        <td className="p-3 text-right font-medium" style={{ color: "#FFB86C" }}>{formatCurrency(r.dailyFee)}</td>
                        <td className="p-3 text-right" style={{ color: "var(--text-secondary)" }}>{formatCurrency(r.monthlyFee)}</td>
                        <td className="p-3 text-right font-bold" style={{ color: "var(--text-primary)" }}>{formatCurrency(r.totalFee)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: "var(--bg-muted)" }}>
                      <td colSpan={8} className="p-3 text-right font-bold rounded-bl-xl" style={{ color: "var(--text-primary)" }}>TỔNG CỘNG:</td>
                      <td className="p-3 text-right font-bold text-lg rounded-br-xl" style={{ color: "#FFB86C" }}>{formatCurrency(totalAllFees)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; background: white !important; color: black !important; }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute; left: 0; top: 0; width: 100%;
            border: none !important; box-shadow: none !important;
            padding: 20px !important; margin: 0 !important;
          }
          .print-area .hidden.print\\:block { display: block !important; visibility: visible !important; }
        }
      `}</style>
    </div>
  );
}
