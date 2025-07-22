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
        <AnimatePresence mode="wait" initial={false}>
          {theme === "light" ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block" }}
            >
              <FaMoon />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block" }}
            >
              <FaSun />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
