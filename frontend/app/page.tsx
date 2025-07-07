"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { QrCode, Smartphone, Wrench } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && user) {
      // Si l'utilisateur est connecté, rediriger vers le dashboard
      router.push("/admin");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            QR Chalets
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plateforme de gestion de QR codes pour chalets en location.
            Facilitez l'accès aux informations pour vos locataires.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              href="/admin/login"
              color="primary"
              size="lg"
              className="px-8"
            >
              Connexion Administration
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardBody className="p-6">
              <div className="text-blue-600 mb-4">
                <Wrench className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gestion simple</h3>
              <p className="text-gray-600">
                Interface intuitive pour créer et gérer vos pages explicatives
              </p>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="p-6">
              <div className="text-blue-600 mb-4">
                <QrCode className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                QR codes automatiques
              </h3>
              <p className="text-gray-600">
                Génération automatique et téléchargement en PDF
              </p>
            </CardBody>
          </Card>

          <Card className="text-center">
            <CardBody className="p-6">
              <div className="text-blue-600 mb-4">
                <Smartphone className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile first</h3>
              <p className="text-gray-600">
                Interface optimisée pour smartphone et tablette
              </p>
            </CardBody>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            Développé pour simplifier la gestion de vos chalets en location
          </p>
        </div>
      </div>
    </div>
  );
}
