"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Background from "@/components/Background";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    // Pour la page login, ne pas afficher la sidebar
    return (
      <div className="relative min-h-screen w-full">
        <div className="absolute inset-0 -z-10 w-full h-full">
          <Background />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          {children}
        </div>
      </div>
    );
  }

  // Pour les autres pages admin, afficher avec sidebar
  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Background />
      </div>
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
}
