"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FloatingItem {
  id: number;
  type: "circle" | "star" | "heart" | "leaf";
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  rotate: number;
}

export function PlayfulBackground() {
  const [items, setItems] = useState<FloatingItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const types: FloatingItem["type"][] = ["circle", "star", "heart", "leaf"];
    const colors = [
      "rgba(255, 184, 108, 0.15)", // Mầm Non Orange
      "rgba(168, 230, 207, 0.18)", // Lá Non Mint
      "rgba(255, 142, 83, 0.12)",  // Soft Peach
      "rgba(33, 150, 243, 0.08)",  // Soft Sky Blue
    ];

    // Generate 12 floating items
    const generated: FloatingItem[] = Array.from({ length: 12 }, (_, i) => {
      const type = types[i % types.length];
      const color = colors[i % colors.length];
      const size = Math.floor(Math.random() * 30) + 20; // 20px - 50px
      const x = Math.random() * 90 + 5; // 5% - 95%
      const y = Math.random() * 85 + 5; // 5% - 90%
      const duration = Math.random() * 15 + 20; // 20s - 35s (slow, premium)
      const delay = Math.random() * -20; // negative delay so they start animated immediately
      const rotate = Math.random() * 360;

      return {
        id: i,
        type,
        x,
        y,
        size,
        color,
        duration,
        delay,
        rotate,
      };
    });

    setItems(generated);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Video Background Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 opacity-20 dark:opacity-10"
        src="https://assets.mixkit.co/videos/preview/mixkit-pastel-watercolor-background-40083-large.mp4"
      />
      {/* Glassmorphism Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-[20px] pointer-events-none bg-[#FFF8F0]/30 dark:bg-[#121212]/30" />

      {items.map((item) => {
        let path = "";

        if (item.type === "star") {
          path = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
        } else if (item.type === "heart") {
          path = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
        } else if (item.type === "leaf") {
          path = "M17 3a5 5 0 0 0-7 0L3 10a5 5 0 0 0 0 7 5 5 0 0 0 7 0l7-7a5 5 0 0 0 0-7z";
        }

        return (
          <motion.div
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: item.size,
              height: item.size,
            }}
            animate={{
              y: [0, -40, 40, 0],
              x: [0, 30, -30, 0],
              rotate: [item.rotate, item.rotate + 180, item.rotate + 360],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.type === "circle" ? (
              <svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                fill={item.color}
              >
                <circle cx="50" cy="50" r="40" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="100%"
                height="100%"
                fill={item.color}
                className="transition-colors duration-300"
              >
                <path d={path} />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
