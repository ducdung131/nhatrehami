"use client";

import { motion } from "framer-motion";
import { Shield, Users, Palette, HeartPulse } from "lucide-react";

const items = [
  { icon: Shield, title: "Môi trường an toàn", desc: "Cơ sở vật chất hiện đại, an toàn tuyệt đối cho trẻ với hệ thống camera giám sát 24/7.", color: "var(--color-primary)", bg: "rgba(255,184,108,0.1)" },
  { icon: Users, title: "Giáo viên tận tâm", desc: "Đội ngũ giáo viên giàu kinh nghiệm, yêu trẻ và được đào tạo chuyên nghiệp.", color: "var(--color-secondary-dark)", bg: "rgba(168,230,207,0.1)" },
  { icon: Palette, title: "Hoạt động ngoại khóa", desc: "Chương trình ngoại khóa phong phú: vẽ, nhạc, thể thao, khám phá thiên nhiên.", color: "var(--color-info)", bg: "rgba(33,150,243,0.1)" },
  { icon: HeartPulse, title: "Chăm sóc sức khỏe", desc: "Theo dõi sức khỏe định kỳ, dinh dưỡng cân bằng và khám sức khỏe thường xuyên.", color: "var(--color-danger)", bg: "rgba(244,67,54,0.1)" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-28" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4" style={{ background: "rgba(168,230,207,0.2)", color: "var(--color-secondary-dark)" }}>
            Về chúng tôi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-[var(--font-display)] mb-4" style={{ color: "var(--text-primary)" }}>
            Tại sao chọn <span className="text-gradient">Hạ Mi</span>?
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Chúng tôi cam kết mang đến môi trường học tập tốt nhất cho con em bạn
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center group">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: item.bg }}>
                <item.icon size={28} style={{ color: item.color }} />
              </div>
              <h3 className="text-lg font-bold mb-2 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
