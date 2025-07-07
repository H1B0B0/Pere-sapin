"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Skeleton } from "@heroui/skeleton";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useAuthStore } from "@/lib/auth-store";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, Page } from "@/types";
import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  PlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
  isMobile?: boolean;
}

export default function AdminSidebar({
  isCollapsed = false,
  onToggle,
  onNavigate,
  isMobile = false,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [chaletPages, setChaletPages] = useState<Record<string, Page[]>>({});
  const [loading, setLoading] = useState(true);

  // Debug log
  useEffect(() => {
    console.log("🔍 AdminSidebar render:", {
      isCollapsed,
      isMobile,
      user: !!user,
      loading,
    });
  }, [isCollapsed, isMobile, user, loading]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const chaletsData = await chaletService.getAll();
      setChalets(chaletsData);

      // Fetch pages for each chalet
      const pagesData: Record<string, Page[]> = {};
      for (const chalet of chaletsData) {
        try {
          const pages = await pageService.getByChaletId(chalet._id);
          pagesData[chalet._id] = pages;
        } catch (error) {
          console.error(
            `Error fetching pages for chalet ${chalet._id}:`,
            error
          );
          pagesData[chalet._id] = [];
        }
      }
      setChaletPages(pagesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const isActivePath = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <aside
      className={`h-screen bg-content1 border-r border-divider flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-80"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-divider">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <QrCodeIcon className="h-8 w-8 text-primary" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-foreground">QR Chalets</h1>
              <p className="text-xs text-foreground-500">Administration</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {!isCollapsed ? (
          <div className="space-y-4">
            {/* Dashboard */}
            <div className="space-y-1">
              <Button
                as={Link}
                href="/admin"
                variant={isActivePath("/admin") ? "flat" : "light"}
                color={isActivePath("/admin") ? "primary" : "default"}
                className="w-full justify-start px-3 py-2 h-auto"
                startContent={<HomeIcon className="h-5 w-5" />}
                onPress={onNavigate}
              >
                Dashboard
              </Button>
            </div>

            <Divider />

            {/* Chalets Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-foreground-600 uppercase tracking-wider px-3">
                  Chalets
                </h3>
                <Button
                  as={Link}
                  href="/admin/chalets/new"
                  isIconOnly
                  size="sm"
                  variant="light"
                  aria-label="Ajouter un chalet"
                  onPress={onNavigate}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 rounded-lg" />
                  ))}
                </div>
              ) : chalets.length === 0 ? (
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="h-12 w-12 mx-auto text-default-300 mb-2" />
                  <p className="text-sm text-foreground-500">Aucun chalet</p>
                  <Button
                    as={Link}
                    href="/admin/chalets/new"
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="mt-2"
                    startContent={<PlusIcon className="h-4 w-4" />}
                    onPress={onNavigate}
                  >
                    Créer un chalet
                  </Button>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Add New Chalet */}
                  <Button
                    as={Link}
                    href="/admin/chalets/new"
                    variant="light"
                    className="w-full justify-start px-3 py-2 h-auto border-dashed border-2 border-default-200"
                    startContent={<PlusIcon className="h-4 w-4" />}
                    onPress={onNavigate}
                  >
                    <div className="flex flex-col items-start">
                      <span>Nouveau chalet</span>
                      <span className="text-xs text-foreground-500">
                        Créer un nouveau chalet
                      </span>
                    </div>
                  </Button>

                  {/* Chalets and their pages */}
                  {chalets.map((chalet) => (
                    <div key={chalet._id} className="space-y-1">
                      {/* Chalet management item */}
                      <Button
                        as={Link}
                        href={`/admin/chalets/${chalet._id}`}
                        variant={
                          isActivePath(`/admin/chalets/${chalet._id}`) &&
                          !pathname.includes("/pages")
                            ? "flat"
                            : "light"
                        }
                        color={
                          isActivePath(`/admin/chalets/${chalet._id}`) &&
                          !pathname.includes("/pages")
                            ? "primary"
                            : "default"
                        }
                        className="w-full justify-start px-3 py-2 h-auto"
                        startContent={
                          <BuildingOfficeIcon className="h-4 w-4" />
                        }
                        endContent={
                          <Chip size="sm" variant="flat" color="primary">
                            {chaletPages[chalet._id]?.length || 0}
                          </Chip>
                        }
                        onPress={onNavigate}
                      >
                        <div className="flex flex-col items-start">
                          <span>{chalet.name}</span>
                          <span className="text-xs text-foreground-500">
                            Gérer le chalet
                          </span>
                        </div>
                      </Button>

                      {/* Pages for this chalet */}
                      {chaletPages[chalet._id]?.map((page) => (
                        <Button
                          key={page._id}
                          as={Link}
                          href={`/admin/chalets/${chalet._id}/pages/${page._id}`}
                          variant={
                            isActivePath(
                              `/admin/chalets/${chalet._id}/pages/${page._id}`
                            )
                              ? "flat"
                              : "light"
                          }
                          color={
                            isActivePath(
                              `/admin/chalets/${chalet._id}/pages/${page._id}`
                            )
                              ? "primary"
                              : "default"
                          }
                          size="sm"
                          className="w-full justify-start px-6 py-1 h-auto ml-4 text-xs"
                          startContent={
                            <DocumentTextIcon className="h-3 w-3" />
                          }
                          onPress={onNavigate}
                        >
                          {page.title}
                        </Button>
                      ))}

                      {/* Add new page item */}
                      <Button
                        as={Link}
                        href={`/admin/chalets/${chalet._id}/pages/new`}
                        variant="light"
                        size="sm"
                        className="w-full justify-start px-6 py-1 h-auto ml-4 text-xs border-dashed border border-default-200"
                        startContent={<PlusIcon className="h-3 w-3" />}
                        onPress={onNavigate}
                      >
                        Nouvelle page
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Collapsed view */
          <div className="space-y-2">
            <Button
              as={Link}
              href="/admin"
              variant={isActivePath("/admin") ? "flat" : "light"}
              color={isActivePath("/admin") ? "primary" : "default"}
              isIconOnly
              className="w-full"
              aria-label="Dashboard"
              onPress={onNavigate}
            >
              <HomeIcon className="h-5 w-5" />
            </Button>

            {chalets.length > 0 && (
              <>
                <Divider className="my-2" />
                {chalets.slice(0, 3).map((chalet) => (
                  <Button
                    key={chalet._id}
                    as={Link}
                    href={`/admin/chalets/${chalet._id}`}
                    variant={
                      isActivePath(`/admin/chalets/${chalet._id}`)
                        ? "flat"
                        : "light"
                    }
                    color={
                      isActivePath(`/admin/chalets/${chalet._id}`)
                        ? "primary"
                        : "default"
                    }
                    isIconOnly
                    className="w-full"
                    aria-label={chalet.name}
                    onPress={onNavigate}
                  >
                    <BuildingOfficeIcon className="h-5 w-5" />
                  </Button>
                ))}
                {chalets.length > 3 && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="default"
                    className="w-full text-center"
                  >
                    +{chalets.length - 3}
                  </Chip>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* User Section */}
      <div className="border-t border-divider p-4">
        {isCollapsed ? (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" isIconOnly className="w-full">
                <Avatar
                  size="sm"
                  name={user?.email?.charAt(0).toUpperCase()}
                  className="h-8 w-8"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="profile"
                className="h-14 gap-2"
                textValue="Profile"
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    size="sm"
                    name={user?.email?.charAt(0).toUpperCase()}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm">{user?.email}</span>
                    <span className="text-xs text-foreground-500">
                      Administrateur
                    </span>
                  </div>
                </div>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                onPress={handleLogout}
              >
                Se déconnecter
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="space-y-3">
            <User
              name={user?.email}
              description="Administrateur"
              avatarProps={{
                size: "sm",
                name: user?.email?.charAt(0).toUpperCase(),
              }}
            />
            <Button
              variant="light"
              color="danger"
              className="w-full justify-start"
              startContent={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
              onPress={handleLogout}
            >
              Se déconnecter
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
