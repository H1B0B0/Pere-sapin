"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Drawer, DrawerContent, DrawerBody } from "@heroui/drawer";
import { useDisclosure } from "@heroui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import AdminSidebar from "./sidebar";
import { useAuthStore } from "@/lib/auth-store";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const { user, initialized, isAuthenticated } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      console.log(
        "🔒 AdminLayout: User not authenticated, redirecting to login"
      );
      // Small delay to prevent loop
      setTimeout(() => {
        router.replace("/admin/login");
      }, 100);
      return;
    }
  }, [initialized, isAuthenticated, router]);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Debug logs
  useEffect(() => {
    console.log("🔍 AdminLayout render:", {
      initialized,
      isAuthenticated,
      user: !!user,
      sidebarCollapsed,
      isMobile,
      drawerOpen: isOpen,
    });
  }, [initialized, isAuthenticated, user, sidebarCollapsed, isMobile, isOpen]);

  // Show loading while checking authentication
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    if (isMobile) {
      onOpen();
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleNavigate = () => {
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          onNavigate={handleNavigate}
          isMobile={false}
        />
      )}

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        size="sm"
        className="md:hidden"
      >
        <DrawerContent>
          <DrawerBody className="p-0">
            <AdminSidebar
              isCollapsed={false}
              onToggle={toggleSidebar}
              onNavigate={handleNavigate}
              isMobile={true}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-content1 border-b border-divider px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="light"
              isIconOnly
              size="sm"
              onPress={toggleSidebar}
              aria-label="Toggle sidebar"
              className="flex-shrink-0"
            >
              <Bars3Icon className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              {/* Breadcrumb or page title could go here */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
