"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Facebook, MessageCircle, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="relative pt-20 pb-8" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {/* School info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl font-[var(--font-display)]">H</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Nhà Trẻ Hạ Mi</h3>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Yêu thương • Chăm sóc • Phát triển</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
              Nơi yêu thương nuôi dưỡng những mầm non tương lai. Chúng tôi cam kết mang đến môi trường học tập an toàn và phát triển toàn diện cho trẻ.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a href="#" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg" style={{ background: "#1877F2", color: "white" }} aria-label="Facebook">
                <Facebook size={22} />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg" style={{ background: "#0068FF", color: "white" }} aria-label="Zalo">
                <MessageCircle size={22} />
              </a>
              <a href="#" className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg" style={{ background: "linear-gradient(135deg, #FF6B6B, #FF8E53)", color: "white" }} aria-label="Messenger">
                <Mail size={22} />
              </a>
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="text-lg font-bold mb-6 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,184,108,0.1)" }}>
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Địa chỉ</p>
                  <a href="https://www.google.com/maps/place/M%E1%BA%A7m+non+H%E1%BA%A1+Mi/@15.3569243,108.7577641,17z/data=!4m9!1m2!2m1!1zTmjDoCB0cuG6uyBo4bqhIG1p!3m5!1s0x3169cbd8c30357db:0x2eca522443e979f2!8m2!3d15.3569244!4d108.762635!16s%2Fg%2F11y4tbwlwb?entry=ttu&g_ep=EgoyMDI2MDYxMC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary transition-colors" style={{ color: "var(--text-secondary)" }}>
                    Đường Trì Bình - Dung Quất, Bình Sơn, Quảng Ngãi, Việt Nam
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,230,207,0.1)" }}>
                  <Phone size={18} className="text-secondary-dark" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Điện thoại</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>0123 456 789</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(33,150,243,0.1)" }}>
                  <Mail size={18} className="text-info" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Email</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>contact@nhatrehami.vn</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map embed */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-bold mb-6 font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Bản đồ</h3>
            <div className="rounded-2xl overflow-hidden shadow-lg h-48">
              <iframe
                src="https://maps.google.com/maps?q=15.3569244,108.762635&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nhà Trẻ Hạ Mi Location"
              />
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-8 text-center" style={{ borderColor: "var(--border-color)" }}>
          <p className="text-sm flex items-center justify-center gap-1" style={{ color: "var(--text-muted)" }}>
            © 2026 Nhà Trẻ Hạ Mi. All Rights Reserved. Made with <Heart size={14} className="text-danger fill-danger" /> in Việt Nam
          </p>
        </div>
      </div>
    </footer>
  );
}
