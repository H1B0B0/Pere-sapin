"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar } from "@heroui/avatar";

export default function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Profile",
      href: "#",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="h-5 w-5 shrink-0 text-foreground" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-foreground" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Avatar
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0"
                    size="sm"
                  />
                ),
              }}
            />
            <ThemeToggle />
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <button
      className="flex items-center py-1 relative space-x-2 text-foreground text-sm font-normal z-20"
      type="button"
    >
      <div className="bg-foreground h-5 w-6 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm shrink-0" />
      <motion.span
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-foreground"
        initial={{ opacity: 0 }}
      >
        Acet Labs
      </motion.span>
    </button>
  );
};

export const LogoIcon = () => {
  return (
    <button
      className="flex items-center py-1 relative space-x-2 text-foreground text-sm font-normal z-20"
      type="button"
    >
      <div className="bg-foreground h-5 w-6 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm shrink-0" />
    </button>
  );
};
