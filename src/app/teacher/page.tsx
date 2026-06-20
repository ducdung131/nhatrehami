"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CalendarCheck, Check, Clock, X as XIcon, GraduationCap, Heart, Phone } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface Student {
  id: string;
  fullName: string;
  birthDate: string;
  gender: string;
  className: string;
  avatar: string | null;
  parent: { fullName: string; phone: string };
}

interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export default function TeacherOverview() {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [className, setClassName] = useState("");
  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/me").then(r => r.json()),
      fetch("/api/students").then(r => r.json()),
      fetch("/api/attendance").then(r => r.json())
    ])
      .then(([userData, sList, aList]) => {
        if (userData.teacher) {
          setClassName(userData.teacher.className);
        }
        if (sList && !sList.error) setStudents(sList);
        if (aList && !aList.error) setAttendances(aList);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    return `${years} tuổi ${months >= 0 ? months : 12 + months} tháng`;
  };

  const todayAttendance = attendances.filter(a => a.date.slice(0, 10) === todayStr);
  const presentCount = todayAttendance.filter(a => a.status === "PRESENT").length;
  const lateCount = todayAttendance.filter(a => a.status === "LATE").length;
  const absentCount = todayAttendance.filter(a => a.status === "ABSENT").length;
  const untrackedCount = students.length - todayAttendance.length;

  if (loading) {
    return <div className="space-y-6">{[1,2,3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>
          Tổng quan lớp {className} 🏫
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Chào mừng bạn đến với khu vực quản lý lớp học</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 text-center">
          <Users size={24} className="mx-auto mb-3 text-primary" />
          <div className="text-2xl font-extrabold" style={{ color: "var(--text-primary)" }}>{students.length}</div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Tổng số học sinh</p>
        </div>
        <div className="card p-5 text-center">
          <Check size={24} className="mx-auto mb-3 text-success" style={{ color: "#4CAF50" }} />
          <div className="text-2xl font-extrabold" style={{ color: "#4CAF50" }}>{presentCount}</div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Có mặt hôm nay</p>
        </div>
        <div className="card p-5 text-center">
          <Clock size={24} className="mx-auto mb-3 text-warning" style={{ color: "#FF9800" }} />
          <div className="text-2xl font-extrabold" style={{ color: "#FF9800" }}>{lateCount}</div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Đi muộn hôm nay</p>
        </div>
        <div className="card p-5 text-center">
          <XIcon size={24} className="mx-auto mb-3 text-danger" style={{ color: "#F44336" }} />
          <div className="text-2xl font-extrabold" style={{ color: "#F44336" }}>{absentCount}</div>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Vắng mặt hôm nay</p>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Danh sách lớp ({students.length})</h2>
        {students.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">👶</div>
            <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Chưa có học sinh</h3>
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Admin chưa phân phối học sinh vào lớp {className}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student, i) => {
              const attToday = todayAttendance.find(a => a.studentId === student.id);
              return (
                <motion.div key={student.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center font-bold text-lg flex-shrink-0 text-white shadow-inner">
                        {student.avatar ? (
                          <img src={student.avatar} alt="" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          getInitials(student.fullName)
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>{student.fullName}</h3>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{calculateAge(student.birthDate)} • {student.gender === "MALE" ? "Nam" : "Nữ"}</p>
                      </div>
                    </div>

                    {attToday ? (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm`} style={{
                        background: attToday.status === "PRESENT" ? "rgba(76,175,80,0.15)" : attToday.status === "LATE" ? "rgba(255,152,0,0.15)" : "rgba(244,67,54,0.15)",
                        color: attToday.status === "PRESENT" ? "#4CAF50" : attToday.status === "LATE" ? "#FF9800" : "#F44336"
                      }}>
                        {attToday.status === "PRESENT" ? "Có mặt" : attToday.status === "LATE" ? "Trễ" : "Vắng"}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Chưa Đ.D</span>
                    )}
                  </div>

                  <div className="pt-3 border-t mt-4 space-y-1" style={{ borderColor: "var(--border-light)" }}>
                    <div className="text-xs flex items-center gap-1 font-medium" style={{ color: "var(--text-muted)" }}>
                      Phụ huynh:
                    </div>
                    <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{student.parent.fullName}</div>
                    <div className="text-xs flex items-center gap-1 mt-1" style={{ color: "var(--text-muted)" }}>
                      <Phone size={10} /> {student.parent.phone}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
