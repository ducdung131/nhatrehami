"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/dashboard/admin-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          const supabase = createClient();
          await supabase.auth.signOut();
          window.location.replace("/login");
          return null;
        }
        if (!r.ok) {
          throw new Error("Temporary server error");
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.role !== "ADMIN") {
          if (data.role === "TEACHER") {
            window.location.replace("/teacher");
          } else if (data.role === "PARENT") {
            window.location.replace("/parent");
          } else {
            window.location.replace("/login");
          }
        } else {
          setAuthorized(true);
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
            window.location.replace("/login");
          } else {
            setAuthorized(true);
          }
        });
      });
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="skeleton w-32 h-10 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-72">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
