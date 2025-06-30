"use client";

import { Switch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Switch
        defaultSelected
        size="sm"
        color="primary"
        thumbIcon={({ isSelected, className }) =>
          isSelected ? (
            <SunFilledIcon className={className} />
          ) : (
            <MoonFilledIcon className={className} />
          )
        }
        aria-label="Theme toggle"
      />
    );
  }

  const isLightMode = theme === "light";

  return (
    <Switch
      isSelected={isLightMode}
      size="sm"
      color="primary"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunFilledIcon className={className} />
        ) : (
          <MoonFilledIcon className={className} />
        )
      }
      onValueChange={(isSelected) => {
        setTheme(isSelected ? "light" : "dark");
      }}
      aria-label={`Switch to ${isLightMode ? "dark" : "light"} mode`}
    />
  );
};
