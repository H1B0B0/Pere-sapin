"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import { BsTree } from "react-icons/bs";

import { siteConfig } from "@/config/site";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Background from "@/components/Background";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative flex flex-col flex-grow h-full">
        {/* Absolute background layer */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <Background />
        </div>
        <Navbar className="alpine-nav" maxWidth="xl" position="sticky">
          <NavbarContent>
            <NavbarMenuToggle className="sm:hidden" />
            <NavbarBrand>
              <Link
                className="font-bold text-inherit flex items-center gap-2 font-display text-xl"
                href="/"
              >
                <BsTree className="h-6 w-6 text-primary" />
                Père Sapin
              </Link>
            </NavbarBrand>
          </NavbarContent>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className="text-sm font-medium"
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <ThemeSwitcher />
            </NavbarItem>
          </NavbarContent>
          <NavbarMenu>
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full"
                  color="foreground"
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          </NavbarMenu>
        </Navbar>
        <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
          {children}
        </main>
      </div>
      <footer>
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-6 m-6">
          <div className="flex items-center gap-2">
            <BsTree className="h-5 w-5 text-primary" />
            <span className="font-semibold font-display text-white">
              Père Sapin
            </span>
          </div>
          <p className="text-sm text-center md:text-left text-white">
            © 2025 Père Sapin. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
