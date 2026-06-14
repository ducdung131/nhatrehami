"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, FileText, Printer, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

interface Student { id: string; fullName: string; className: string }

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<"growth" | "attendance" | null>(null);

  useEffect(() => {
    fetch("/api/students")
      .then(r => r.json())
      .then(data => { if (!data.error) setStudents(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelectStudent = async (studentId: string) => {
    if (!studentId) {
      setSelectedStudent("");
      setStudentData(null);
      return;
    }
    setSelectedStudent(studentId);
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${studentId}`);
      const data = await res.json();
      if (!data.error) setStudentData(data);
    } catch {
      toast.error("Không thể tải thông tin học sinh");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hide on print */}
      <div className="no-print space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Báo cáo</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tổng hợp báo cáo và xuất dữ liệu</p>
        </div>

        {!reportType ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: "attendance" as const, title: "Báo cáo chuyên cần", desc: "Thống kê tỷ lệ điểm danh theo tháng, quý, năm", icon: BarChart3, color: "#FFB86C" },
              { type: "growth" as const, title: "Báo cáo phát triển", desc: "Biểu đồ chiều cao, cân nặng theo thời gian", icon: FileText, color: "#A8E6CF" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${item.color}15` }}>
                  <item.icon size={28} style={{ color: item.color }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
                <button onClick={() => setReportType(item.type)} className="btn-primary !py-2 !px-4 text-sm !rounded-xl">Xem báo cáo</button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button onClick={() => { setReportType(null); setSelectedStudent(""); setStudentData(null); }} className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: "var(--text-secondary)" }}>
              <ChevronLeft size={16} /> Quay lại danh mục
            </button>

            <div className="card p-5 space-y-4">
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                {reportType === "growth" ? "Báo cáo phát triển" : "Báo cáo chuyên cần"}
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select value={selectedStudent} onChange={e => handleSelectStudent(e.target.value)} className="px-4 py-2.5 rounded-xl border text-sm outline-none w-full max-w-xs" style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>
                  <option value="">Chọn học sinh...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.fullName} - {s.className}</option>)}
                </select>
                {studentData && (
                  <button onClick={handlePrint} className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2">
                    <Printer size={18} /> In / Xuất PDF
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Area */}
      {studentData && reportType && (
        <div className="print-area font-sans bg-white text-black p-8 rounded-2xl shadow border max-w-4xl mx-auto" style={{ color: "#111" }}>
          {/* Header */}
          <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: "#FFB86C" }}>
            <h2 className="text-2xl font-bold font-[var(--font-display)] text-primary">TRƯỜNG MẦM NON HẠ MI</h2>
            <p className="text-sm text-gray-600">Địa chỉ: Đường Trì Bình - Dung Quất, Bình Sơn, Quảng Ngãi, Việt Nam</p>
            <p className="text-sm text-gray-600">Điện thoại: 0123 456 789</p>
            <h1 className="text-3xl font-extrabold mt-6 uppercase tracking-wider text-gray-800">
              {reportType === "growth" ? "Báo Cáo Chỉ Số Phát Triển" : "Báo Cáo Chuyên Cần Chi Tiết"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Ngày lập báo cáo: {new Date().toLocaleDateString("vi-VN")}</p>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl text-sm border">
            <div>
              <p><strong>Họ và tên:</strong> {studentData.fullName}</p>
              <p><strong>Ngày sinh:</strong> {new Date(studentData.birthDate).toLocaleDateString("vi-VN")}</p>
              <p><strong>Giới tính:</strong> {studentData.gender === "MALE" ? "Nam" : "Nữ"}</p>
            </div>
            <div>
              <p><strong>Lớp học:</strong> {studentData.className}</p>
              <p><strong>Phụ huynh:</strong> {studentData.parent?.fullName || "Chưa cập nhật"}</p>
              <p><strong>Số điện thoại:</strong> {studentData.parent?.phone || "Chưa cập nhật"}</p>
            </div>
          </div>

          {/* Data Table */}
          {reportType === "growth" ? (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Lịch sử đo chiều cao và cân nặng</h3>
              {studentData.growthRecords && studentData.growthRecords.length > 0 ? (
                <table className="w-full text-sm border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">Ngày đo</th>
                      <th className="border border-gray-300 p-2 text-center">Chiều cao (cm)</th>
                      <th className="border border-gray-300 p-2 text-center">Cân nặng (kg)</th>
                      <th className="border border-gray-300 p-2 text-left">Ghi chú sức khỏe</th>
                      <th className="border border-gray-300 p-2 text-left">Nhận xét của giáo viên</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.growthRecords.map((r: any) => (
                      <tr key={r.id}>
                        <td className="border border-gray-300 p-2">{new Date(r.date).toLocaleDateString("vi-VN")}</td>
                        <td className="border border-gray-300 p-2 text-center font-bold text-orange-600">{r.height} cm</td>
                        <td className="border border-gray-300 p-2 text-center font-bold text-green-600">{r.weight} kg</td>
                        <td className="border border-gray-300 p-2 text-xs">{r.healthNote || "-"}</td>
                        <td className="border border-gray-300 p-2 text-xs">{r.teacherComment || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-6">Chưa có dữ liệu chiều cao cân nặng</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Thống kê điểm danh</h3>
              {studentData.attendances && studentData.attendances.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-700">
                        {studentData.attendances.filter((a: any) => a.status === "PRESENT").length}
                      </div>
                      <div className="text-xs text-green-600">Ngày đi học đầy đủ</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-700">
                        {studentData.attendances.filter((a: any) => a.status === "LATE").length}
                      </div>
                      <div className="text-xs text-yellow-600">Ngày đi trễ</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                      <div className="text-2xl font-bold text-red-700">
                        {studentData.attendances.filter((a: any) => a.status === "ABSENT").length}
                      </div>
                      <div className="text-xs text-red-600">Ngày nghỉ học</div>
                    </div>
                  </div>

                  <table className="w-full text-sm border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Ngày</th>
                        <th className="border border-gray-300 p-2 text-center">Trạng thái</th>
                        <th className="border border-gray-300 p-2 text-left">Lý do / Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData.attendances.slice(0, 15).map((a: any) => (
                        <tr key={a.id}>
                          <td className="border border-gray-300 p-2">{new Date(a.date).toLocaleDateString("vi-VN")}</td>
                          <td className="border border-gray-300 p-2 text-center font-bold">
                            {a.status === "PRESENT" && <span className="text-green-600">Có mặt</span>}
                            {a.status === "LATE" && <span className="text-yellow-600">Đi trễ</span>}
                            {a.status === "ABSENT" && <span className="text-red-600">Vắng mặt</span>}
                          </td>
                          <td className="border border-gray-300 p-2 text-xs">{a.note || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">Chưa có dữ liệu điểm danh</p>
              )}
            </div>
          )}

          {/* Footer Signature */}
          <div className="mt-12 pt-8 border-t flex justify-between text-sm">
            <div className="text-center w-48">
              <p><strong>Giáo viên chủ nhiệm</strong></p>
              <p className="text-xs text-gray-500 mt-12">(Ký và ghi rõ họ tên)</p>
            </div>
            <div className="text-center w-48">
              <p><strong>Hiệu trưởng</strong></p>
              <p className="text-xs text-gray-500 mt-12">(Ký tên và đóng dấu)</p>
            </div>
          </div>
        </div>
      )}

      {/* Styling for Print */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
