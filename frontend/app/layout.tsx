"use client";

import { fontSans, fontMono, fontDisplay } from "@/config/fonts";
import { Providers } from "./providers";
import "../styles/globals.css";
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
          fontMono.variable,
          fontDisplay.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
