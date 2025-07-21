import { useEffect, useRef, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { createScope, animate, stagger } from "animejs";

const Background: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Use next-themes to determine if dark mode is active
  const isDark = useMemo(() => {
    if (!mounted) return true; // Default to dark during SSR
    return resolvedTheme === "dark";
  }, [resolvedTheme, mounted]);

  // AnimeJS v4 animation on mount (only run once)
  useEffect(() => {
    if (!rootRef.current) return;
    const scope = createScope({ root: rootRef.current });
    // Animate mountains (slide up + fade in)
    animate(".mountain-bg", {
      translateY: [60, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: stagger(120),
      ease: "outQuart",
    });
    // Animate snow caps (fade in)
    animate(".snow-cap", {
      opacity: [0, 0.7],
      duration: 1000,
      delay: stagger(200, { start: 400 }),
      ease: "outQuart",
    });
    // Animate trees (scale up + fade in)
    animate(".motif-tree", {
      scale: [0.7, 1],
      opacity: [0, 0.18],
      duration: 900,
      delay: stagger(60, { start: 800 }),
      ease: "outBack",
    });
    return () => scope.revert();
  }, []);

  // Colors for light/dark - recalculated when isDark changes
  const colors = useMemo(() => {
    return {
      sky: isDark ? ["#232946", "#181c2a"] : ["#b3e0ff", "#e6f7ff"],
      mountain1: isDark ? ["#2d3748", "#1a202c"] : ["#b0c4de", "#6b7a8f"],
      mountain2: isDark ? ["#4a5568", "#2d3748"] : ["#dbeafe", "#a0aec0"],
      mountain3: isDark ? ["#718096", "#4a5568"] : ["#f8fafc", "#cbd5e1"],
      snow: isDark ? "#e2e8f0" : "#fff",
      motif: isDark ? "#2e7d32" : "#4ade80"
    };
  }, [isDark]);

  return (
    <div
      ref={rootRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1920 1080"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.sky[0]} />
            <stop offset="100%" stopColor={colors.sky[1]} />
          </linearGradient>
          <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.mountain1[0]} />
            <stop offset="100%" stopColor={colors.mountain1[1]} />
          </linearGradient>
          <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.mountain2[0]} />
            <stop offset="100%" stopColor={colors.mountain2[1]} />
          </linearGradient>
          <linearGradient id="mountain3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.mountain3[0]} />
            <stop offset="100%" stopColor={colors.mountain3[1]} />
          </linearGradient>
        </defs>
        {/* Sky */}
        <rect width="1920" height="1080" fill="url(#sky)" />
        {/* Farthest mountains */}
        <path
          className="mountain-bg"
          d="M0 800 Q 400 600 800 800 T 1920 800 V 1080 H 0 Z"
          fill="url(#mountain3)"
        />
        {/* Middle mountains */}
        <path
          className="mountain-bg"
          d="M0 900 Q 300 700 700 900 T 1920 900 V 1080 H 0 Z"
          fill="url(#mountain2)"
        />
        {/* Foreground mountains */}
        <path
          className="mountain-bg"
          d="M0 1000 Q 500 850 1000 1000 T 1920 1000 V 1080 H 0 Z"
          fill="url(#mountain1)"
        />
        {/* Snow caps */}
        <path
          className="snow-cap"
          d="M350 800 Q 400 750 450 800 Q 500 770 550 800"
          fill={colors.snow}
          opacity="0.7"
        />
        <path
          className="snow-cap"
          d="M1200 900 Q 1250 850 1300 900 Q 1350 870 1400 900"
          fill={colors.snow}
          opacity="0.7"
        />
        {/* Tapping/tree motifs (simple pine trees, repeated) */}
        <g>
          {[...Array(16)].map((_, i) => {
            const x = 80 + i * 120 + (i % 2 === 0 ? 0 : 40);
            const y = 1020 - (i % 3) * 30;
            return (
              <g className="motif-tree" key={i} style={{ opacity: 0 }}>
                {/* Pine tree shape */}
                <polygon
                  points={`${x},${y} ${x - 18},${y + 40} ${x + 18},${y + 40}`}
                  fill={colors.motif}
                />
                <rect
                  x={x - 3}
                  y={y + 40}
                  width={6}
                  height={18}
                  fill={colors.motif}
                  opacity={0.7}
                  rx={2}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default Background;
