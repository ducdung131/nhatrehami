"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { Home, TrendingUp, MessageSquare, Bell, LogOut, Sun, Moon, Menu, X, UserCog } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Convert a base64 URL string to a Uint8Array (needed for push subscription)
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register service worker and subscribe to push notifications
 */
async function registerPushNotifications() {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications not supported");
      return;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.log("Service Worker registered:", registration.scope);

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return;
    }

    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      // Already subscribed - send to server to make sure it's saved
      await saveSubscription(existingSubscription);
      return;
    }

    // Subscribe to push
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.error("VAPID public key not configured");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    });

    // Save to server
    await saveSubscription(subscription);
    console.log("Push subscription created successfully");
  } catch (error) {
    console.error("Failed to register push notifications:", error);
  }
}

async function saveSubscription(subscription: PushSubscription) {
  const subJSON = subscription.toJSON();
  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: subJSON.endpoint,
      keys: {
        p256dh: subJSON.keys?.p256dh,
        auth: subJSON.keys?.auth,
      },
    }),
  });
}

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        if (data.role !== "PARENT") {
          if (data.role === "ADMIN") {
            window.location.replace("/admin");
          } else if (data.role === "TEACHER") {
            window.location.replace("/teacher");
          } else {
            window.location.replace("/login");
          }
        } else {
          setAuthorized(true);
          // Register push notifications when parent logs in
          registerPushNotifications();
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err);
        // On network/server 500 error, retry or redirect without forcing signOut
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session) {
            window.location.replace("/login");
          } else {
            // If they still have a local session, keep trying / let them stay
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

  const handleLogout = async () => {
    const s = createClient();
    await s.auth.signOut();
    window.location.replace("/login");
  };

  const tabs = [
    { href: "/parent", icon: Home, label: "Tổng quan" },
    { href: "/parent/growth", icon: TrendingUp, label: "Phát triển" },
    { href: "/parent/comments", icon: MessageSquare, label: "Nhận xét" },
    { href: "/parent/notifications", icon: Bell, label: "Thông báo" },
    { href: "/parent/profile", icon: UserCog, label: "Hồ sơ" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b px-4 sm:px-6 h-16 flex items-center justify-between" style={{ background: "var(--bg-card)", borderColor: "var(--border-light)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="sm:hidden p-2 rounded-xl" aria-label="Menu"><Menu size={22} /></button>
          <Link href="/parent" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"><span className="text-white font-bold text-sm">H</span></div>
            <span className="font-bold font-[var(--font-display)]" style={{ color: "var(--text-primary)" }}>Hạ Mi</span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {tabs.map(t => (
            <Link key={t.href} href={t.href} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${pathname === t.href ? "text-white shadow-md" : ""}`} style={pathname === t.href ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" } : { color: "var(--text-secondary)" }}>
              <t.icon size={16} />{t.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {mounted && <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5" aria-label="Theme">{theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}</button>}
          <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-danger/10" style={{ color: "var(--color-danger)" }} aria-label="Logout"><LogOut size={18} /></button>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileMenu && (
        <div className="sm:hidden border-b py-2 px-4 space-y-1" style={{ background: "var(--bg-card)", borderColor: "var(--border-light)" }}>
          {tabs.map(t => (
            <Link key={t.href} href={t.href} onClick={() => setMobileMenu(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${pathname === t.href ? "text-white" : ""}`} style={pathname === t.href ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))" } : { color: "var(--text-secondary)" }}>
              {t.label}
            </Link>
          ))}
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
