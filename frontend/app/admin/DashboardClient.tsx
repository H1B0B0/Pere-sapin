"use client";

import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import React from "react";
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
import { DashboardStats, RecentActivity } from "@/lib/services/dashboard";

interface Props {
  initialStats: DashboardStats;
  initialActivity: RecentActivity[];
}

export default function DashboardClient({
  initialStats,
  initialActivity,
}: Props) {
  const getActivityIcon = (type: RecentActivity["type"]) => {
    switch (type) {
      case "chalet_created":
        return <BsTree className="text-success" />;
      case "page_created":
        return <BsFileText className="text-primary" />;
      case "page_updated":
        return <BsFileText className="text-warning" />;
      default:
        return <BsFileText />;
    }
  };

  const getActivityColor = (type: RecentActivity["type"]) => {
    switch (type) {
      case "chalet_created":
        return "success";
      case "page_created":
        return "primary";
      case "page_updated":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-success-50 to-success-100 border-success-200">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-success rounded-lg">
                <BsTree className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-small text-success-600">Chalets</p>
                <p className="text-2xl font-bold text-success-700">
                  {initialStats.totalChalets}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary rounded-lg">
                <BsFileText className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-small text-primary-600">Pages</p>
                <p className="text-2xl font-bold text-primary-700">
                  {initialStats.totalPages}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border-secondary-200">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-secondary rounded-lg">
                <BsQrCode className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-small text-secondary-600">QR Codes</p>
                <p className="text-2xl font-bold text-secondary-700">
                  {initialStats.totalQRCodes}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-warning rounded-lg">
                <BsEye className="text-2xl text-white" />
              </div>
              <div>
                <p className="text-small text-warning-600">Vues récentes</p>
                <p className="text-2xl font-bold text-warning-700">
                  {initialStats.recentViews}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Actions rapides</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                as={Link}
                className="h-20 bg-success text-white"
                href="/admin/chalets/new"
                startContent={<BsPlus className="text-xl" />}
              >
                <div className="text-left">
                  <div className="font-semibold">Nouveau Chalet</div>
                  <div className="text-sm opacity-80">Créer un chalet</div>
                </div>
              </Button>

              <Button
                as={Link}
                className="h-20 bg-primary text-white"
                href="/admin/pages"
                startContent={<BsFileText className="text-xl" />}
              >
                <div className="text-left">
                  <div className="font-semibold">Gérer les Pages</div>
                  <div className="text-sm opacity-80">
                    Voir toutes les pages
                  </div>
                </div>
              </Button>

              <Button
                as={Link}
                className="h-20 bg-secondary text-white"
                href="/admin/qr-codes"
                startContent={<BsDownload className="text-xl" />}
              >
                <div className="text-left">
                  <div className="font-semibold">QR Codes</div>
                  <div className="text-sm opacity-80">Télécharger QR codes</div>
                </div>
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold">Activité récente</h2>
          </CardHeader>
          <CardBody>
            {initialActivity.length > 0 ? (
              <div className="space-y-4">
                {initialActivity.map((activity) => (
                  <div
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-200"
                    key={activity.id}
                  >
                    <div className="p-2 rounded-full">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{activity.title}</div>
                      {activity.chaletName && (
                        <div className="text-sm">
                          Chalet: {activity.chaletName}
                        </div>
                      )}
                      <div className="text-xs">{activity.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune activité récente
              </p>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
