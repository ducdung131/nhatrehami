"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function ParentCommentsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(data => {
      if (data.parent?.students) {
        Promise.all(data.parent.students.map((s: any) => fetch(`/api/students/${s.id}`).then(r => r.json()))).then(kids => {
          const allRecords = kids.flatMap((k: any) => (k.growthRecords || []).filter((r: any) => r.teacherComment).map((r: any) => ({ ...r, studentName: k.fullName })));
          allRecords.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setRecords(allRecords);
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Nhận xét giáo viên</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nhận xét hàng tháng từ giáo viên</p>
      </div>

      {records.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare size={48} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Chưa có nhận xét</h3>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5" style={{ background: "var(--border-color)" }} />

          <div className="space-y-6">
            {records.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative pl-14">
                <div className="absolute left-4 top-6 w-5 h-5 rounded-full border-4 z-10" style={{ borderColor: "var(--color-primary)", background: "var(--bg-card)" }} />
                <div className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(255,184,108,0.1)", color: "var(--color-primary-dark)" }}>{r.studentName}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{new Date(r.date).toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{r.teacherComment}</p>
                  {r.healthNote && <p className="text-xs mt-2 italic" style={{ color: "var(--text-muted)" }}>Sức khỏe: {r.healthNote}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
