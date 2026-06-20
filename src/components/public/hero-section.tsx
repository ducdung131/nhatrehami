"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import { PlayfulBackground } from "@/components/public/playful-background";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero">
      <PlayfulBackground />
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blob animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blob animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-light rounded-full blob animate-float" style={{ animationDelay: "2s" }} />

      {/* Floating decorative elements */}
      <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 10, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-32 right-[15%] hidden lg:block">
        <Star size={32} className="text-primary fill-primary/30" />
      </motion.div>
      <motion.div animate={{ y: [10, -10, 10], rotate: [0, -15, 15, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-40 left-[10%] hidden lg:block">
        <Heart size={28} className="text-danger fill-danger/30" />
      </motion.div>
      <motion.div animate={{ y: [-5, 15, -5], scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-48 left-[20%] hidden lg:block">
        <Sparkles size={24} className="text-secondary-dark" />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary-dark">Chào mừng đến với Hạ Mi</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-[var(--font-display)] leading-tight mb-6">
              <span className="text-gradient">Nhà Trẻ</span>
              <br />
              <span className="text-gradient">Hạ Mi</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg sm:text-xl mb-8 leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
              Nơi yêu thương nuôi dưỡng những mầm non tương lai
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap gap-4">
              <Link href="/login" className="btn-primary text-base inline-flex items-center gap-2">
                <Heart size={18} />
                Đăng nhập
              </Link>
              <a href="#contact" className="btn-secondary text-base inline-flex items-center gap-2">
                Liên hệ
              </a>
            </motion.div>

            {/* Mini stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex gap-8 mt-12">
              {[
                { num: "200+", label: "Học sinh" },
                { num: "15+", label: "Giáo viên" },
                { num: "10+", label: "Năm kinh nghiệm" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-gradient">{s.num}</div>
                  <div className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image Area */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 gradient-primary rounded-[3rem] rotate-6 opacity-20" />
              <div className="absolute inset-0 gradient-secondary rounded-[3rem] -rotate-3 opacity-20" />
              <div className="relative card rounded-[2.5rem] overflow-hidden h-full flex items-center justify-center p-8" style={{ background: "var(--bg-card)" }}>
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-xl">
                    <span className="text-5xl">🌸</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Nhà Trẻ Hạ Mi</h3>
                    <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>Yêu thương • Chăm sóc • Phát triển</p>
                  </div>
                  <div className="flex justify-center gap-3">
                    {["🎨", "📚", "🎵", "⚽", "🌿"].map((e, i) => (
                      <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }} className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: "var(--bg-muted)" }}>
                        {e}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C360,120 1080,40 1440,80 V120 H0 Z" fill="var(--bg-primary)" />
        </svg>
      </div>
    </section>
  );
}
