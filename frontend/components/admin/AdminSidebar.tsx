"use client";

import { useState, useEffect } from "react";
import { Card, Button, Accordion, AccordionItem } from "@heroui/react";
import {
  BsHouse,
  BsGear,
  BsTree,
  BsFileText,
  BsPlus,
  BsList,
  BsX,
} from "react-icons/bs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import { useAdminStore } from "@/lib/stores/admin-store";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Utilisation du store global
  const { chalets, loading, initialized, initialize, getPagesForChalet } =
    useAdminStore();

  // Initialiser le store au montage
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  // Optionnel: rafraîchir uniquement si nécessaire
  // useEffect(() => {
  //   if (initialized) {
  //     const interval = setInterval(() => {
  //       refreshData();
  //     }, 300000); // Rafraîchir toutes les 5 minutes seulement
  //
  //     return () => clearInterval(interval);
  //   }
  // }, [initialized, refreshData]);

  const isActiveLink = (href: string) => pathname === href;

  return (
    <div
      className={clsx(
        "overflow-y-auto border-r border-border/20 transition-all duration-300 ease-in-out m-2 rounded-lg",
        isCollapsed ? "w-30" : "w-80",
        "h-[calc(100%-1rem)]"
      )}
    >
      <Card className="alpine-card h-full rounded-none border-0 border-r border-border/20">
        <div
          className={clsx(
            "transition-all duration-300 flex flex-col h-full",
            isCollapsed ? "p-3" : "p-6"
          )}
        >
          {/* Logo/Titre Admin avec bouton collapse */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BsTree className="h-8 w-8 text-primary" />
              {!isCollapsed && (
                <div>
                  <h1 className="font-bold text-xl font-display gradient-festive bg-clip-text text-transparent">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-muted-foreground">Père Sapin</p>
                </div>
              )}
            </div>
            <Button
              isIconOnly
              className="min-w-unit-8 w-8 h-8"
              size="sm"
              variant="light"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <BsList className="h-4 w-4" />
              ) : (
                <BsX className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation principale */}
          <nav className="space-y-2 mb-8">
            <Link className="block" href="/admin">
              <Button
                className={clsx(
                  "w-full gap-3 h-12 transition-all duration-300",
                  isActiveLink("/admin") &&
                    "btn-alpine text-primary-foreground",
                  isCollapsed ? "justify-center px-0" : "justify-start"
                )}
                color={isActiveLink("/admin") ? "primary" : "default"}
                startContent={<BsHouse className="h-5 w-5" />}
                variant={isActiveLink("/admin") ? "solid" : "ghost"}
              >
                {!isCollapsed && "Dashboard"}
              </Button>
            </Link>

            <Link className="block" href="/admin/chalets">
              <Button
                className={clsx(
                  "w-full gap-3 h-12 transition-all duration-300",
                  isActiveLink("/admin/chalets") &&
                    "btn-alpine text-primary-foreground",
                  isCollapsed ? "justify-center px-0" : "justify-start"
                )}
                color={isActiveLink("/admin/chalets") ? "primary" : "default"}
                startContent={<BsGear className="h-5 w-5" />}
                variant={isActiveLink("/admin/chalets") ? "solid" : "ghost"}
              >
                {!isCollapsed && "Gestion Chalets"}
              </Button>
            </Link>
          </nav>

          {/* Section Chalets avec pages */}
          {!isCollapsed && (
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg text-foreground">
                    Chalets
                  </h2>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                    <BsTree className="h-3 w-3" />
                    {chalets.length}
                  </div>
                </div>
                <Link href="/admin/chalets/new">
                  <Button
                    className="btn-alpine text-primary-foreground"
                    color="primary"
                    size="sm"
                    startContent={<BsPlus className="h-4 w-4" />}
                  >
                    Nouveau
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                </div>
              ) : chalets.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 mx-auto bg-muted/30 rounded-full flex items-center justify-center">
                    <BsTree className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Aucun chalet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Créez votre premier chalet
                    </p>
                  </div>
                  <Link href="/admin/chalets/new">
                    <Button
                      color="primary"
                      size="sm"
                      startContent={<BsPlus className="h-4 w-4" />}
                      variant="flat"
                    >
                      Créer un chalet
                    </Button>
                  </Link>
                </div>
              ) : (
                <Accordion
                  className="px-0"
                  itemClasses={{
                    base: "alpine-card mb-2 border border-border/20 hover:border-primary/30 transition-colors",
                    title: "font-medium text-foreground",
                    trigger:
                      "py-3 px-4 hover:bg-muted/20 rounded-t-lg transition-colors",
                    content: "px-4 pb-4",
                    indicator: "text-muted-foreground",
                  }}
                  selectionMode="multiple"
                  variant="shadow"
                >
                  {chalets.map((chalet) => {
                    const chaletPages = getPagesForChalet(chalet._id);
                    const totalViews = chaletPages.reduce(
                      (sum, page) => sum + (page.views || 0),
                      0
                    );

                    return (
                      <AccordionItem
                        key={chalet._id}
                        aria-label={chalet.name}
                        className="rounded-lg bg-transparent"
                        title={
                          <div className="flex items-center justify-between w-full rounded-lg bg-transparent">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-500 rounded-lg flex items-center justify-center shadow-sm">
                                <BsTree className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex flex-col items-start">
                                <span className="font-semibold text-foreground truncate max-w-32">
                                  {chalet.name}
                                </span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>
                                    {chaletPages.length} page
                                    {chaletPages.length !== 1 ? "s" : ""}
                                  </span>
                                  {totalViews > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {totalViews} vue
                                        {totalViews !== 1 ? "s" : ""}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                {chaletPages.length}
                              </div>
                            </div>
                          </div>
                        }
                      >
                        <div className="space-y-3 mt-2">
                          {/* Boutons de gestion du chalet */}
                          <div className="flex gap-2">
                            <Link
                              className="flex-1"
                              href={`/admin/chalets/${chalet._id}`}
                            >
                              <Button
                                className="w-full h-8 text-xs"
                                color="primary"
                                size="sm"
                                startContent={<BsGear className="h-3 w-3" />}
                                variant="flat"
                              >
                                Gérer
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/chalets/${chalet._id}/pages/new`}
                            >
                              <Button
                                className="h-8 text-xs"
                                color="success"
                                size="sm"
                                startContent={<BsPlus className="h-3 w-3" />}
                                variant="flat"
                              >
                                Page
                              </Button>
                            </Link>
                          </div>

                          {/* Liste des pages */}
                          {chaletPages.length > 0 ? (
                            <div className="space-y-1 pl-4 border-l-2 border-primary/20">
                              {chaletPages.map((page) => (
                                <Link
                                  key={page._id}
                                  className="block group"
                                  href={`/admin/chalets/${chalet._id}/pages/${page.slug}/edit`}
                                >
                                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <BsFileText className="h-3 w-3 text-primary/70 flex-shrink-0" />
                                      <span className="text-xs text-foreground truncate group-hover:text-primary transition-colors">
                                        {page.title}
                                      </span>
                                    </div>
                                    {page.views > 0 && (
                                      <div className="text-xs text-muted-foreground bg-muted/20 px-1.5 py-0.5 rounded-full flex-shrink-0 ml-2">
                                        {page.views}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-4 text-center">
                              <div className="space-y-2">
                                <BsFileText className="h-6 w-6 text-muted-foreground mx-auto opacity-50" />
                                <p className="text-xs text-muted-foreground">
                                  Aucune page créée
                                </p>
                                <Link
                                  href={`/admin/chalets/${chalet._id}/pages/new`}
                                >
                                  <Button
                                    className="text-xs h-7"
                                    color="primary"
                                    size="sm"
                                    startContent={
                                      <BsPlus className="h-3 w-3" />
                                    }
                                    variant="light"
                                  >
                                    Créer une page
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          )}

          {/* Actions rapides en bas */}
          <div className="mt-auto pt-4 border-t border-border/20">
            <div className={clsx(
              "flex gap-2",
              isCollapsed ? "justify-center" : "justify-start"
            )}>
              <Link href="/admin/settings">
                <Button
                  isIconOnly={isCollapsed}
                  className={clsx(
                    "gap-3 transition-all duration-300",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                  startContent={<BsGear className="h-4 w-4" />}
                  variant="light"
                >
                  {!isCollapsed && "Paramètres"}
                </Button>
              </Link>

              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
