import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nhà Trẻ Hạ Mi - Nơi yêu thương nuôi dưỡng những mầm non tương lai",
    template: "%s | Nhà Trẻ Hạ Mi",
  },
  description:
    "Nhà Trẻ Hạ Mi - Trường mầm non với môi trường học tập an toàn, giáo viên tận tâm, và chương trình chăm sóc sức khỏe toàn diện cho trẻ.",
  keywords: [
    "nhà trẻ",
    "mầm non",
    "Hạ Mi",
    "Bình Sơn",
    "Quảng Ngãi",
    "trường mầm non",
    "chăm sóc trẻ",
  ],
  authors: [{ name: "Nhà Trẻ Hạ Mi" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Nhà Trẻ Hạ Mi",
    description: "Nơi yêu thương nuôi dưỡng những mầm non tương lai",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hạ Mi" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="icon" href="/icon.png" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
