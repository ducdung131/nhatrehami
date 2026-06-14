"use client";

import { motion } from "framer-motion";
import { Ruler, Weight, CalendarCheck, Bell, MessageSquare, BarChart3 } from "lucide-react";

const features = [
  { icon: Ruler, title: "Theo dõi chiều cao", desc: "Ghi nhận và biểu đồ hóa sự phát triển chiều cao của trẻ theo thời gian.", color: "#FFB86C" },
  { icon: Weight, title: "Theo dõi cân nặng", desc: "Theo dõi cân nặng hàng tháng, phát hiện sớm các vấn đề dinh dưỡng.", color: "#A8E6CF" },
  { icon: CalendarCheck, title: "Theo dõi điểm danh", desc: "Quản lý điểm danh hàng ngày, thống kê tỷ lệ chuyên cần tự động.", color: "#2196F3" },
  { icon: Bell, title: "Thông báo tức thời", desc: "Phụ huynh nhận thông báo ngay lập tức từ nhà trường.", color: "#FF9800" },
  { icon: MessageSquare, title: "Nhận xét giáo viên", desc: "Giáo viên gửi nhận xét chi tiết về sự phát triển của từng bé.", color: "#E91E63" },
  { icon: BarChart3, title: "Báo cáo phát triển", desc: "Báo cáo tổng hợp với biểu đồ trực quan, hỗ trợ xuất PDF.", color: "#9C27B0" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 relative" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: "rgba(255,184,108,0.2)", color: "var(--color-primary-dark)" }}>
            Tính năng
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-display)] mb-4" style={{ color: "var(--text-primary)" }}>
            Quản lý <span className="text-gradient">toàn diện</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Hệ thống quản lý hiện đại giúp theo dõi mọi khía cạnh phát triển của trẻ
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="card p-6 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-8 translate-x-8 transition-transform group-hover:scale-150" style={{ background: f.color }} />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-lg" style={{ background: `${f.color}15`, boxShadow: `0 0 0 0 ${f.color}` }}>
                  <f.icon size={26} style={{ color: f.color }} />
                </div>
                <h3 className="text-lg font-bold mb-2 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
