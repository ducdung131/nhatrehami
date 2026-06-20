"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, FileText, Printer, ChevronLeft, Check, Users, CalendarDays, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Student { id: string; fullName: string; className: string }
interface TuitionCalc {
  studentId: string; studentName: string; className: string;
  presentDays: number; absentDays: number; totalDays: number;
  dailyRate: number; dailyFee: number; monthlyFee: number; totalFee: number;
}

export default function ReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentsData, setStudentsData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState<"growth" | "attendance" | "tuition" | null>(null);
  const [tuitionMonth, setTuitionMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [tuitionData, setTuitionData] = useState<TuitionCalc[]>([]);

  useEffect(() => {
    fetch("/api/students")
      .then(r => r.json())
      .then(data => { if (!data.error) setStudents(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const uniqueClasses = [...new Set(students.map(s => s.className))];

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const toggleClass = (className: string) => {
    const classStudentIds = students.filter(s => s.className === className).map(s => s.id);
    const allSelected = classStudentIds.every(id => selectedStudents.includes(id));
    if (allSelected) {
      setSelectedStudents(prev => prev.filter(id => !classStudentIds.includes(id)));
    } else {
      setSelectedStudents(prev => [...new Set([...prev, ...classStudentIds])]);
    }
  };

  const selectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleGenerateReport = useCallback(async () => {
    if (selectedStudents.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 học sinh");
      return;
    }
    setGenerating(true);
    try {
      // Fetch all selected students' data in a single request!
      const res = await fetch(`/api/students?ids=${selectedStudents.join(",")}`);
      const data = await res.json();
      
      const results: Record<string, any> = {};
      if (Array.isArray(data)) {
        data.forEach(student => {
          results[student.id] = student;
        });
      }
      setStudentsData(results);

      // Also fetch tuition if tuition report
      if (reportType === "tuition") {
        const params = new URLSearchParams({ month: tuitionMonth });
        const tuitionRes = await fetch(`/api/tuition/calculate?${params}`);
        const tuitionAll = await tuitionRes.json();
        if (!tuitionAll.error) {
          setTuitionData(tuitionAll.filter((t: TuitionCalc) => selectedStudents.includes(t.studentId)));
        }
      }

      toast.success(`Đã tạo báo cáo cho ${selectedStudents.length} học sinh`);
    } catch {
      toast.error("Lỗi khi tạo báo cáo");
    } finally {
      setGenerating(false);
    }
  }, [selectedStudents, reportType, tuitionMonth]);

  const handlePrint = () => window.print();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const handleReset = () => {
    setReportType(null);
    setSelectedStudents([]);
    setStudentsData({});
    setTuitionData([]);
  };

  return (
    <div className="space-y-6">
      {/* Controls - hide on print */}
      <div className="no-print space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Báo cáo</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Tổng hợp báo cáo và xuất dữ liệu hàng loạt</p>
        </div>

        {!reportType ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { type: "attendance" as const, title: "Báo cáo chuyên cần", desc: "Thống kê tỷ lệ điểm danh theo tháng, quý, năm", icon: BarChart3, color: "#FFB86C" },
              { type: "growth" as const, title: "Báo cáo phát triển", desc: "Biểu đồ chiều cao, cân nặng theo thời gian", icon: FileText, color: "#A8E6CF" },
              { type: "tuition" as const, title: "Báo cáo học phí", desc: "Bảng tính học phí theo điểm danh hàng tháng", icon: DollarSign, color: "#2196F3" },
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
            <button onClick={handleReset} className="inline-flex items-center gap-1 text-sm font-semibold hover:underline" style={{ color: "var(--text-secondary)" }}>
              <ChevronLeft size={16} /> Quay lại danh mục
            </button>

            <div className="card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                  {reportType === "growth" ? "Báo cáo phát triển" : reportType === "attendance" ? "Báo cáo chuyên cần" : "Báo cáo học phí"}
                </h3>
                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  <Users size={16} />
                  Đã chọn: <span className="font-bold" style={{ color: "var(--color-primary-dark)" }}>{selectedStudents.length}</span>
                </div>
              </div>

              {/* Tuition month selector */}
              {reportType === "tuition" && (
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} style={{ color: "var(--text-muted)" }} />
                  <input
                    type="month"
                    value={tuitionMonth}
                    onChange={e => setTuitionMonth(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                  />
                </div>
              )}

              {/* Student Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Chọn học sinh:</p>
                  <button
                    onClick={selectAll}
                    className="text-xs font-semibold px-3 py-1 rounded-lg transition-colors"
                    style={{ color: "var(--color-primary-dark)", background: "rgba(255,184,108,0.1)" }}
                  >
                    {selectedStudents.length === students.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </button>
                </div>

                {/* Group by class */}
                {uniqueClasses.map(cls => {
                  const classStudents = students.filter(s => s.className === cls);
                  const allInClassSelected = classStudents.every(s => selectedStudents.includes(s.id));
                  return (
                    <div key={cls} className="rounded-xl border" style={{ borderColor: "var(--border-light)" }}>
                      <button
                        onClick={() => toggleClass(cls)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors"
                        style={{ color: "var(--text-primary)", background: allInClassSelected ? "rgba(255,184,108,0.05)" : "transparent" }}
                      >
                        <div
                          className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: allInClassSelected ? "var(--color-primary)" : "var(--border-color)",
                            background: allInClassSelected ? "var(--color-primary)" : "transparent"
                          }}
                        >
                          {allInClassSelected && <Check size={12} className="text-white" />}
                        </div>
                        📚 {cls} ({classStudents.length} học sinh)
                      </button>
                      <div className="px-4 pb-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {classStudents.map(s => {
                          const isSelected = selectedStudents.includes(s.id);
                          return (
                            <button
                              key={s.id}
                              onClick={() => toggleStudent(s.id)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all border"
                              style={{
                                borderColor: isSelected ? "var(--color-primary)" : "var(--border-light)",
                                background: isSelected ? "rgba(255,184,108,0.08)" : "transparent",
                                color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                              }}
                            >
                              <div
                                className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0"
                                style={{
                                  borderColor: isSelected ? "var(--color-primary)" : "var(--border-color)",
                                  background: isSelected ? "var(--color-primary)" : "transparent"
                                }}
                              >
                                {isSelected && <Check size={10} className="text-white" />}
                              </div>
                              {s.fullName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleGenerateReport}
                  disabled={generating || selectedStudents.length === 0}
                  className="btn-primary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 !rounded-xl disabled:opacity-50"
                >
                  {generating ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                  Tạo báo cáo ({selectedStudents.length})
                </button>
                {Object.keys(studentsData).length > 0 && (
                  <button onClick={handlePrint} className="btn-secondary !py-2.5 !px-5 text-sm inline-flex items-center gap-2 !rounded-xl">
                    <Printer size={18} />
                    In tất cả
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Printable Area - Multiple reports */}
      {reportType && Object.keys(studentsData).length > 0 && (
        <div className="print-area space-y-0">
          {selectedStudents.map((studentId, pageIdx) => {
            const studentData = studentsData[studentId];
            if (!studentData) return null;
            const tuition = tuitionData.find(t => t.studentId === studentId);

            return (
              <div key={studentId} className="font-sans bg-white text-black p-8 rounded-2xl shadow border max-w-4xl mx-auto mb-6 page-break" style={{ color: "#111" }}>
                {/* Header */}
                <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: "#FFB86C" }}>
                  <h2 className="text-2xl font-bold font-[var(--font-display)] text-primary">TRƯỜNG MẦM NON HẠ MI</h2>
                  <p className="text-sm text-gray-600">Địa chỉ: Đường Trì Bình - Dung Quất, Bình Sơn, Quảng Ngãi, Việt Nam</p>
                  <p className="text-sm text-gray-600">Điện thoại: 0123 456 789</p>
                  <h1 className="text-3xl font-extrabold mt-6 uppercase tracking-wider text-gray-800">
                    {reportType === "growth" ? "Báo Cáo Chỉ Số Phát Triển" : reportType === "attendance" ? "Báo Cáo Chuyên Cần Chi Tiết" : "Báo Cáo Học Phí"}
                  </h1>
                  {reportType === "tuition" && <p className="text-sm text-gray-500 mt-1">Tháng: {tuitionMonth}</p>}
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
                    {studentData.parent?.citizenId && (
                      <p><strong>CCCD:</strong> {studentData.parent.citizenId}</p>
                    )}
                    {studentData.parent?.address && (
                      <p><strong>Địa chỉ:</strong> {studentData.parent.address}</p>
                    )}
                  </div>
                </div>

                {/* Report Content */}
                {reportType === "growth" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Lịch sử đo chiều cao và cân nặng</h3>
                    {studentData.growthRecords?.length > 0 ? (
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
                      <p className="text-gray-500 text-center py-6">Chưa có dữ liệu</p>
                    )}
                  </div>
                )}

                {reportType === "attendance" && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Thống kê điểm danh</h3>
                    {studentData.attendances?.length > 0 ? (
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
                            {studentData.attendances.map((a: any) => (
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
                      <p className="text-gray-500 text-center py-6">Chưa có dữ liệu</p>
                    )}
                  </div>
                )}

                {reportType === "tuition" && tuition && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Chi tiết học phí tháng {tuitionMonth}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <p className="text-sm text-blue-600 mb-1">Số ngày đi học</p>
                        <p className="text-3xl font-bold text-blue-700">{tuition.presentDays} <span className="text-sm font-normal">ngày</span></p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <p className="text-sm text-red-600 mb-1">Số ngày nghỉ</p>
                        <p className="text-3xl font-bold text-red-700">{tuition.absentDays} <span className="text-sm font-normal">ngày</span></p>
                      </div>
                    </div>
                    <table className="w-full text-sm border-collapse border border-gray-300">
                      <tbody>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">Mức phí / ngày</td>
                          <td className="border border-gray-300 p-3 text-right font-bold">{formatCurrency(tuition.dailyRate)}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Học phí theo ngày ({tuition.presentDays} ngày × {formatCurrency(tuition.dailyRate)})</td>
                          <td className="border border-gray-300 p-3 text-right font-bold text-orange-600">{formatCurrency(tuition.dailyFee)}</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">Phí cố định hàng tháng</td>
                          <td className="border border-gray-300 p-3 text-right font-bold">{formatCurrency(tuition.monthlyFee)}</td>
                        </tr>
                        <tr className="bg-orange-50">
                          <td className="border border-gray-300 p-3 font-bold text-lg">TỔNG HỌC PHÍ</td>
                          <td className="border border-gray-300 p-3 text-right font-bold text-xl text-orange-600">{formatCurrency(tuition.totalFee)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tuition section for growth/attendance reports (if tuition data exists) */}
                {reportType !== "tuition" && tuition && (
                  <div className="mt-6 pt-4 border-t space-y-2">
                    <h4 className="font-bold text-sm">Thông tin học phí tháng {tuitionMonth}</h4>
                    <p className="text-sm">Ngày đi học: <strong>{tuition.presentDays}</strong> | Học phí: <strong className="text-orange-600">{formatCurrency(tuition.totalFee)}</strong></p>
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
            );
          })}
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
          .page-break {
            page-break-after: always;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .page-break:last-child {
            page-break-after: auto;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
