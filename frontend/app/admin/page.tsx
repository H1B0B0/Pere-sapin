"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsTree,
  BsFileText,
  BsQrCode,
  BsEye,
  BsPlus,
  BsDownload,
} from "react-icons/bs";
import Link from "next/link";

import {
  dashboardService,
  DashboardStats,
  RecentActivity,
} from "@/lib/services/dashboard";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalChalets: 0,
    totalPages: 0,
    totalQRCodes: 0,
    recentViews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, recentActivityData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentActivity(),
        ]);

        setStats(dashboardStats);
        setRecentActivity(recentActivityData);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard:", error);
        // Fallback to demo data on error
        setStats({
          totalChalets: 0,
          totalPages: 0,
          totalQRCodes: 0,
          recentViews: 0,
        });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "page_created":
      case "page_updated":
        return <BsFileText className="h-4 w-4" />;
      case "chalet_created":
        return <BsTree className="h-4 w-4" />;
      default:
        return <BsFileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "page_created":
        return "success";
      case "page_updated":
        return "warning";
      case "chalet_created":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
              Dashboard Admin
            </h1>
            <p className="text-muted-foreground mt-2">
              Bienvenue dans votre panneau d&apos;administration Père Sapin
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/chalets/new">
              <Button
                className="btn-alpine text-primary-foreground"
                color="primary"
                startContent={<BsPlus className="h-4 w-4" />}
              >
                Nouveau Chalet
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-primary/20">
              <BsTree className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalChalets}
              </p>
              <p className="text-sm text-muted-foreground">Chalets</p>
            </div>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-success/20">
              <BsFileText className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalPages}
              </p>
              <p className="text-sm text-muted-foreground">Pages créées</p>
            </div>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-warning/20">
              <BsQrCode className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalQRCodes}
              </p>
              <p className="text-sm text-muted-foreground">QR Codes</p>
            </div>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-secondary/20">
              <BsEye className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.recentViews}
              </p>
              <p className="text-sm text-muted-foreground">Vues (7j)</p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activité récente */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="alpine-card">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Activité récente
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/20"
                  >
                    <Chip
                      color={getActivityColor(activity.type) as any}
                      size="sm"
                      startContent={getActivityIcon(activity.type)}
                      variant="flat"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {activity.title}
                      </p>
                      {activity.chaletName && (
                        <p className="text-xs text-muted-foreground">
                          {activity.chaletName}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="alpine-card">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Actions rapides
              </h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/admin/chalets">
                  <Button
                    className="h-20 w-full flex-col gap-2"
                    color="primary"
                    startContent={<BsTree className="h-6 w-6" />}
                    variant="flat"
                  >
                    Gérer les chalets
                  </Button>
                </Link>

                <Link href="/admin/pages">
                  <Button
                    className="h-20 w-full flex-col gap-2"
                    color="success"
                    startContent={<BsFileText className="h-6 w-6" />}
                    variant="flat"
                  >
                    Toutes les pages
                  </Button>
                </Link>

                <Link href="/admin/qr-codes">
                  <Button
                    className="h-20 w-full flex-col gap-2"
                    color="warning"
                    startContent={<BsQrCode className="h-6 w-6" />}
                    variant="flat"
                  >
                    QR Codes
                  </Button>
                </Link>

                <Button
                  className="h-20 w-full flex-col gap-2"
                  color="secondary"
                  startContent={<BsDownload className="h-6 w-6" />}
                  variant="flat"
                >
                  Export PDF
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
