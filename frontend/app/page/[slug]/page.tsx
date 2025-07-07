"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Page } from "@/types";
import { pageService } from "@/lib/services/pages";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { RichContent } from "@/components/ui/rich-content";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ClockIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function PageView() {
  const params = useParams();
  const slug = params.slug as string;
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const pageData = await pageService.getBySlug(slug);
        setPage(pageData);
      } catch (err) {
        setError("Page non trouvée");
        console.error("Error fetching page:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              Chargement de la page...
            </p>
            <p className="text-sm text-default-600">
              Veuillez patienter un moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">📄</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Page non trouvée
              </h1>
              <p className="text-default-600">
                La page demandée n'existe pas ou n'est plus disponible.
              </p>
            </div>
          </div>
          <Button
            as={Link}
            href="/"
            color="primary"
            variant="flat"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
            size="lg"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  const chaletName =
    typeof page.chalet === "string" ? page.chalet : page.chalet.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            as={Link}
            href="/"
            variant="light"
            startContent={<ArrowLeftIcon className="h-4 w-4" />}
            className="mb-6 text-default-600 hover:text-primary"
          >
            Retour à l'accueil
          </Button>

          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-default-600">
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>Chalet {chaletName}</span>
            </div>

            {/* Title and Meta */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {page.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-default-600">
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    Mis à jour le{" "}
                    {new Date(page.updatedAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {page.tags && page.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {page.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        variant="flat"
                        color="primary"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardBody className="p-8 sm:p-12">
            <RichContent
              content={page.content}
              className="prose-lg sm:prose-xl"
            />
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-default-500">
            Cette page fait partie du système QR Chalets
          </p>
        </div>
      </div>
    </div>
  );
}
