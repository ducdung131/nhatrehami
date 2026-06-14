"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, BookOpen, CalendarCheck, TrendingUp } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface ChildData {
  id: string; fullName: string; avatar: string | null; birthDate: string;
  gender: string; className: string;
  growthRecords: { date: string; height: number; weight: number }[];
  attendances: { status: string }[];
}

export default function ParentDashboard() {
  const [children, setChildren] = useState<ChildData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(data => {
      if (data.parent?.students) {
        // Fetch full data for each student
        Promise.all(data.parent.students.map((s: { id: string }) =>
          fetch(`/api/students/${s.id}`).then(r => r.json())
        )).then(setChildren);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    return `${years} tuổi ${months >= 0 ? months : 12 + months} tháng`;
  };

  if (loading) {
    return <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
          Xin chào! 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Theo dõi sự phát triển của con em bạn</p>
      </div>

      {children.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">👶</div>
          <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Chưa có thông tin</h3>
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Vui lòng liên hệ nhà trường để được cập nhật thông tin con em</p>
        </div>
      ) : (
        children.map((child, ci) => {
          const totalAttendance = child.attendances?.length || 0;
          const presentCount = child.attendances?.filter(a => a.status === "PRESENT" || a.status === "LATE").length || 0;
          const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
          const latestGrowth = child.growthRecords?.[0];

          return (
            <motion.div key={child.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
              {/* Child profile card */}
              <div className="card p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
                    {child.avatar ? <img src={child.avatar} alt="" className="w-full h-full rounded-3xl object-cover" /> : getInitials(child.fullName)}
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>{child.fullName}</h2>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{calculateAge(child.birthDate)} • {child.gender === "MALE" ? "Nam" : "Nữ"}</p>
                    <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,184,108,0.1)", color: "var(--color-primary-dark)" }}>
                        <BookOpen size={12} />{child.className}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                  <TrendingUp size={20} className="mx-auto mb-2" style={{ color: "#FFB86C" }} />
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{latestGrowth?.height || "-"} cm</div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Chiều cao</p>
                </div>
                <div className="card p-4 text-center">
                  <User size={20} className="mx-auto mb-2" style={{ color: "#A8E6CF" }} />
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{latestGrowth?.weight || "-"} kg</div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Cân nặng</p>
                </div>
                <div className="card p-4 text-center">
                  <CalendarCheck size={20} className="mx-auto mb-2" style={{ color: "#2196F3" }} />
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{attendanceRate}%</div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Chuyên cần</p>
                </div>
                <div className="card p-4 text-center">
                  <BookOpen size={20} className="mx-auto mb-2" style={{ color: "#9C27B0" }} />
                  <div className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{child.growthRecords?.length || 0}</div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Bản ghi</p>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
