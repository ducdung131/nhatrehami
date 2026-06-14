import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { FeaturesSection } from "@/components/public/features-section";
import { StatsSection } from "@/components/public/stats-section";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
      <Footer />
    </main>
  );
}
