"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        isIconOnly
        aria-label="Changer le thème"
        className="text-lg"
        variant="light"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <AnimatePresence initial={false} mode="wait">
          {theme === "light" ? (
            <motion.span
              key="moon"
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              style={{ display: "inline-block" }}
              transition={{ duration: 0.3 }}
            >
              <FaMoon />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              style={{ display: "inline-block" }}
              transition={{ duration: 0.3 }}
            >
              <FaSun />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
