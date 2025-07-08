"use client";
import type { Metadata } from "next";
import { fontSans, fontMono } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";
import "../styles/globals.css";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
} from "@heroui/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import clsx from "clsx";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers>
          <div className="relative flex flex-col h-screen">
            <Navbar maxWidth="xl" position="sticky">
              <NavbarContent>
                <NavbarMenuToggle className="sm:hidden" />
                <NavbarBrand>
                  <Link href="/" className="font-bold text-inherit">
                    🎄 Père Sapin
                  </Link>
                </NavbarBrand>
              </NavbarContent>

              <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {siteConfig.navItems.map((item) => (
                  <NavbarItem key={item.href}>
                    <Link
                      color="foreground"
                      href={item.href}
                      className="text-sm font-medium"
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
                <NavbarItem className="hidden lg:flex">
                  <Link href="/login" className="text-sm">
                    Connexion
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Button
                    as={Link}
                    color="primary"
                    href="/register"
                    variant="flat"
                  >
                    S'inscrire
                  </Button>
                </NavbarItem>
              </NavbarContent>

              <NavbarMenu>
                {siteConfig.navMenuItems.map((item, index) => (
                  <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                      color="foreground"
                      className="w-full"
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
            <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-6">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎄</span>
                <span className="font-semibold text-default-700">
                  Père Sapin
                </span>
              </div>
              <p className="text-sm text-default-500 text-center md:text-left">
                © 2025 Père Sapin. Tous droits réservés.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
