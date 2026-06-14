"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetClass: string | null;
  createdAt: string;
}

export default function ParentNotificationsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setItems(data);
          // Local native notification display logic
          if (
            data.length > 0 &&
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            const lastNotified = localStorage.getItem("last_notified_announcement");
            const newest = data[0];
            if (lastNotified !== newest.id) {
              new Notification("Thông báo mới từ Hạ Mi 🔔", {
                body: `${newest.title}: ${newest.content.substring(0, 60)}...`,
                icon: "/icon.png",
              });
              localStorage.setItem("last_notified_announcement", newest.id);
            }
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 rounded-2xl" />
        ))}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Thông báo</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Thông báo mới nhất từ nhà trường</p>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell size={48} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Chưa có thông báo mới</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,184,108,0.1)" }}
                >
                  <Megaphone size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </h3>
                    {i === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-danger text-white">
                        Mới
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {item.content}
                  </p>
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
