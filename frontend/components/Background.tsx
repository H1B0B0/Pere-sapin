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
      opacity: [0, 0.45],
      duration: 900,
      delay: stagger(60, { start: 800 }),
      ease: "outBack",
    });

    // Animate clouds (gentle float)
    animate(".clouds", {
      opacity: [0, 0.6],
      translateX: [-20, 0],
      duration: 1500,
      delay: 600,
      ease: "outQuart",
    });

    return () => scope.revert();
  }, []);

  // Colors for light/dark - recalculated when isDark changes
  const colors = useMemo(() => {
    return {
      // Ciel plus dramatique et montagnard
      sky: isDark ? ["#1a1f2e", "#0f1419"] : ["#87ceeb", "#4682b4"],
      // Montagnes avec des tons plus rocheux et imposants
      mountain1: isDark ? ["#2c3e50", "#1a252f"] : ["#708090", "#2f4f4f"],
      mountain2: isDark ? ["#34495e", "#2c3e50"] : ["#9ca3af", "#6b7280"],
      mountain3: isDark ? ["#4a5568", "#34495e"] : ["#d1d5db", "#9ca3af"],
      // Neige plus éclatante
      snow: isDark ? "#f8fafc" : "#ffffff",
      // Sapins des Vosges plus authentiques
      motif: isDark ? "#1b4332" : "#2d5016",
      // Nuages naturels
      clouds: isDark ? "#374151" : "#f1f5f9",
    };
  }, [isDark]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      <svg
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "100%" }}
        viewBox="0 0 1920 1080"
        width="100%"
      >
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colors.sky[0]} />
            <stop offset="100%" stopColor={colors.sky[1]} />
          </linearGradient>
          <linearGradient id="mountain1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colors.mountain1[0]} />
            <stop offset="100%" stopColor={colors.mountain1[1]} />
          </linearGradient>
          <linearGradient id="mountain2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colors.mountain2[0]} />
            <stop offset="100%" stopColor={colors.mountain2[1]} />
          </linearGradient>
          <linearGradient id="mountain3" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={colors.mountain3[0]} />
            <stop offset="100%" stopColor={colors.mountain3[1]} />
          </linearGradient>
        </defs>
        {/* Sky */}
        <rect fill="url(#sky)" height="1080" width="1920" />

        {/* Nuages organiques */}
        <g className="clouds" opacity="0.6">
          {/* Nuage 1 */}
          <g>
            <ellipse cx="300" cy="200" fill={colors.clouds} rx="60" ry="25" />
            <ellipse cx="340" cy="190" fill={colors.clouds} rx="45" ry="20" />
            <ellipse cx="280" cy="185" fill={colors.clouds} rx="35" ry="18" />
            <ellipse cx="350" cy="210" fill={colors.clouds} rx="40" ry="22" />
          </g>

          {/* Nuage 2 */}
          <g>
            <ellipse cx="800" cy="150" fill={colors.clouds} rx="70" ry="30" />
            <ellipse cx="850" cy="140" fill={colors.clouds} rx="55" ry="25" />
            <ellipse cx="770" cy="135" fill={colors.clouds} rx="40" ry="20" />
            <ellipse cx="830" cy="165" fill={colors.clouds} rx="45" ry="25" />
          </g>

          {/* Nuage 3 */}
          <g>
            <ellipse cx="1400" cy="180" fill={colors.clouds} rx="65" ry="28" />
            <ellipse cx="1450" cy="170" fill={colors.clouds} rx="50" ry="23" />
            <ellipse cx="1380" cy="165" fill={colors.clouds} rx="38" ry="19" />
            <ellipse cx="1430" cy="195" fill={colors.clouds} rx="42" ry="24" />
          </g>

          {/* Nuage 4 - plus petit */}
          <g>
            <ellipse cx="600" cy="120" fill={colors.clouds} rx="35" ry="15" />
            <ellipse cx="620" cy="115" fill={colors.clouds} rx="25" ry="12" />
            <ellipse cx="585" cy="110" fill={colors.clouds} rx="20" ry="10" />
          </g>

          {/* Nuage 5 - plus petit */}
          <g>
            <ellipse cx="1200" cy="100" fill={colors.clouds} rx="40" ry="18" />
            <ellipse cx="1225" cy="95" fill={colors.clouds} rx="30" ry="14" />
            <ellipse cx="1180" cy="90" fill={colors.clouds} rx="25" ry="12" />
          </g>
        </g>

        {/* Farthest mountains - Crêtes plus angulaires */}
        <path
          className="mountain-bg"
          d="M0 850 L 200 650 L 350 750 L 500 580 L 650 720 L 800 620 L 950 780 L 1200 650 L 1400 750 L 1600 680 L 1920 800 V 1080 H 0 Z"
          fill="url(#mountain3)"
        />
        {/* Middle mountains - Pics plus prononcés */}
        <path
          className="mountain-bg"
          d="M0 950 L 150 750 L 280 820 L 450 700 L 600 850 L 750 720 L 900 880 L 1100 750 L 1300 850 L 1500 780 L 1700 900 L 1920 920 V 1080 H 0 Z"
          fill="url(#mountain2)"
        />
        {/* Foreground mountains - Relief plus marqué */}
        <path
          className="mountain-bg"
          d="M0 1050 L 120 900 L 220 980 L 350 850 L 480 950 L 600 880 L 750 1000 L 900 900 L 1050 980 L 1200 920 L 1350 1000 L 1500 950 L 1650 1020 L 1920 1000 V 1080 H 0 Z"
          fill="url(#mountain1)"
        />
        {/* Neige naturelle sur les sommets - correctement orientée */}
        <g className="snow-cap">
          {/* Neige sur le pic le plus haut (500, 580) */}
          <path
            d="M485 595 Q 492 585 500 580 Q 508 585 515 595 Q 510 590 505 588 Q 500 585 495 588 Q 490 590 485 595 Z"
            fill={colors.snow}
            opacity="0.85"
          />

          {/* Neige sur le pic (800, 620) */}
          <path
            d="M785 635 Q 792 625 800 620 Q 808 625 815 635 Q 810 630 805 628 Q 800 625 795 628 Q 790 630 785 635 Z"
            fill={colors.snow}
            opacity="0.8"
          />

          {/* Neige sur le pic (1200, 650) */}
          <path
            d="M1185 665 Q 1192 655 1200 650 Q 1208 655 1215 665 Q 1210 660 1205 658 Q 1200 655 1195 658 Q 1190 660 1185 665 Z"
            fill={colors.snow}
            opacity="0.8"
          />

          {/* Neige sur pic moyen (350, 850) */}
          <path
            d="M335 865 Q 342 855 350 850 Q 358 855 365 865 Q 360 860 355 858 Q 350 855 345 858 Q 340 860 335 865 Z"
            fill={colors.snow}
            opacity="0.75"
          />

          {/* Neige sur pic (1100, 750) */}
          <path
            d="M1085 765 Q 1092 755 1100 750 Q 1108 755 1115 765 Q 1110 760 1105 758 Q 1100 755 1095 758 Q 1090 760 1085 765 Z"
            fill={colors.snow}
            opacity="0.75"
          />

          {/* Ajout de quelques traces de neige sur les pentes - repositionnées */}
          <ellipse
            cx="470"
            cy="610"
            fill={colors.snow}
            opacity="0.4"
            rx="12"
            ry="6"
          />
          <ellipse
            cx="1320"
            cy="780"
            fill={colors.snow}
            opacity="0.4"
            rx="10"
            ry="5"
          />
          <ellipse
            cx="820"
            cy="650"
            fill={colors.snow}
            opacity="0.3"
            rx="14"
            ry="7"
          />
        </g>
        {/* Sapins des Vosges - plus réalistes et visibles */}
        <g>
          {[...Array(18)].map((_, i) => {
            const x = 60 + i * 110 + (i % 2 === 0 ? 0 : 35);
            const y = 1020 - (i % 4) * 25;
            const height = 45 + (i % 3) * 10;
            const width = 20 + (i % 2) * 8;

            return (
              <g key={i} className="motif-tree" style={{ opacity: 0 }}>
                {/* Étages du sapin (3 niveaux) */}
                <polygon
                  fill={colors.motif}
                  points={`${x},${y} ${x - width / 2},${y + height / 2} ${x + width / 2},${y + height / 2}`}
                />
                <polygon
                  fill={colors.motif}
                  points={`${x},${y + height / 3} ${x - width / 1.5},${y + height * 0.75} ${x + width / 1.5},${y + height * 0.75}`}
                />
                <polygon
                  fill={colors.motif}
                  points={`${x},${y + height / 1.8} ${x - width / 2.5},${y + height} ${x + width / 2.5},${y + height}`}
                />

                {/* Tronc plus visible */}
                <rect
                  fill={isDark ? "#8b4513" : "#654321"}
                  height={20}
                  rx={2}
                  width={8}
                  x={x - 4}
                  y={y + height}
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
