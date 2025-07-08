// app/components/ThemeSwitcher.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        isIconOnly
        variant="light"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Changer le thème"
        className="text-lg"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </Button>
    </motion.div>
  );
}
