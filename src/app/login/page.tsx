"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PlayfulBackground } from "@/components/public/playful-background";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Vui lòng nhập đầy đủ thông tin"); return; }
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        toast.error("Đăng nhập thất bại: " + error.message);
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("remembered_email", email);
      } else {
        localStorage.removeItem("remembered_email");
      }

      // Fetch user role from our DB
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (data.role === "ADMIN") {
        toast.success("Chào mừng Admin!");
        router.push("/admin");
      } else if (data.role === "TEACHER") {
        toast.success("Chào mừng Giáo viên!");
        router.push("/teacher");
      } else {
        toast.success("Đăng nhập thành công!");
        router.push("/parent");
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex gradient-hero relative">
      <PlayfulBackground />
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blob animate-float" />
        <div className="absolute bottom-32 right-20 w-80 h-80 bg-secondary rounded-full blob animate-float" style={{ animationDelay: "1.5s" }} />

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center space-y-8">
          <div className="w-28 h-28 mx-auto rounded-3xl gradient-primary flex items-center justify-center shadow-2xl">
            <span className="text-5xl">🌸</span>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold font-[var(--font-display)] text-gradient mb-3">Nhà Trẻ Hạ Mi</h1>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Nơi yêu thương nuôi dưỡng<br />những mầm non tương lai</p>
          </div>
          <div className="flex justify-center gap-4">
            {["🎨", "📚", "🎵", "⚽", "🌿"].map((e, i) => (
              <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, delay: i * 0.2, repeat: Infinity }} className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-2xl">
                {e}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 hover:text-primary transition-colors" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft size={16} /> Về trang chủ
          </Link>

          <div className="card p-8 sm:p-10">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-primary" />
                <h2 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Đăng nhập</h2>
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Chào mừng bạn trở lại!</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>Mật khẩu</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-12 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" style={{ background: "var(--bg-muted)", borderColor: "var(--border-color)", color: "var(--text-primary)" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--text-muted)" }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border text-primary focus:ring-primary/30 cursor-pointer"
                    style={{ accentColor: "var(--color-primary)" }}
                  />
                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    Ghi nhớ tài khoản của tôi
                  </span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary !rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={18} /> Đăng nhập</>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
