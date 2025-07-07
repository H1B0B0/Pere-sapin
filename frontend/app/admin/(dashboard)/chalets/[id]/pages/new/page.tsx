"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, CreatePageDto } from "@/types";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { RichEditor } from "@/components/ui/rich-editor";

export default function NewPagePage() {
  const router = useRouter();
  const params = useParams();
  const chaletId = params.id as string;

  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingChalet, setLoadingChalet] = useState(true);
  const [formData, setFormData] = useState<CreatePageDto>({
    title: "",
    content: "",
    slug: "",
    chalet: chaletId,
  });
  const [errors, setErrors] = useState<Partial<CreatePageDto>>({});

  useEffect(() => {
    if (chaletId) {
      fetchChalet();
    }
  }, [chaletId]);

  const fetchChalet = async () => {
    try {
      setLoadingChalet(true);
      const chaletData = await chaletService.getById(chaletId);
      setChalet(chaletData);
    } catch (error) {
      console.error("Error fetching chalet:", error);
      router.push("/admin");
    } finally {
      setLoadingChalet(false);
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  };

  const validateForm = () => {
    const newErrors: Partial<CreatePageDto> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre de la page est requis";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Le slug de la page est requis";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Le contenu de la page est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await pageService.create(formData);
      router.push(`/admin/chalets/${chaletId}`);
    } catch (error) {
      console.error("Error creating page:", error);
      // Handle error (you might want to show a toast or error message)
    } finally {
      setLoading(false);
    }
  };

  if (loadingChalet) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-default-200 rounded w-48 mb-4" />
          <div className="h-4 bg-default-200 rounded w-32" />
        </div>
        <Card className="animate-pulse">
          <CardBody>
            <div className="h-32 bg-default-200 rounded" />
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-semibold mb-4">Chalet non trouvé</h1>
        <Link href="/admin">
          <Button color="primary">Retour au dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              as={Link}
              href={`/admin/chalets/${chaletId}`}
              variant="light"
              isIconOnly
              size="sm"
              className="flex-shrink-0"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Nouvelle page
              </h1>
              <p className="text-default-600">
                Créer une nouvelle page pour{" "}
                <span className="font-medium text-primary">{chalet.name}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            as={Link}
            href={`/admin/chalets/${chaletId}`}
            variant="bordered"
            className="hidden sm:flex"
          >
            Annuler
          </Button>
          <Button
            color="primary"
            onPress={() => handleSubmit()}
            isLoading={loading}
            isDisabled={
              !formData.title.trim() ||
              !formData.slug.trim() ||
              !formData.content.trim() ||
              formData.content === "<p></p>"
            }
            className="min-w-32"
          >
            {loading ? "Création..." : "Créer la page"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Title */}
        <Card className="border border-default-200 shadow-sm">
          <CardBody className="p-6">
            <Input
              label="Titre de la page"
              placeholder="Ex: Informations pratiques, Guide d'accueil..."
              value={formData.title}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  title: value,
                  // Auto-generate slug from title if slug is empty or was auto-generated
                  slug:
                    !prev.slug ||
                    prev.slug === generateSlugFromTitle(prev.title)
                      ? generateSlugFromTitle(value)
                      : prev.slug,
                }));
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              isRequired
              variant="bordered"
              size="lg"
              classNames={{
                input: "text-lg font-medium",
                inputWrapper: "border-2 focus-within:border-primary",
              }}
              errorMessage={errors.title}
              isInvalid={!!errors.title}
            />
          </CardBody>
        </Card>

        {/* Slug */}
        <Card className="border border-default-200 shadow-sm">
          <CardBody className="p-6">
            <Input
              label="Slug de la page"
              placeholder="Ex: informations-pratiques, guide-accueil..."
              description="L'URL unique de cette page (lettres minuscules, chiffres et tirets uniquement)"
              value={formData.slug}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, slug: value }));
                if (errors.slug) {
                  setErrors((prev) => ({ ...prev, slug: undefined }));
                }
              }}
              isRequired
              variant="bordered"
              classNames={{
                inputWrapper: "border-2 focus-within:border-primary",
              }}
              errorMessage={errors.slug}
              isInvalid={!!errors.slug}
            />
          </CardBody>
        </Card>

        {/* Content Editor */}
        <Card className="border border-default-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Contenu de la page</h3>
                <p className="text-sm text-default-600 mt-1">
                  Utilisez l'éditeur pour créer un contenu riche avec du
                  formatage, des liens, des listes, etc.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            {errors.content && (
              <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-700 text-sm">{errors.content}</p>
              </div>
            )}
            <RichEditor
              content={formData.content}
              onChange={handleContentChange}
              placeholder="Commencez à écrire le contenu de votre page... Vous pouvez utiliser les outils de formatage pour créer un contenu riche et attrayant."
            />
          </CardBody>
        </Card>

        {/* Info Card */}
        <Card className="bg-secondary/5 border border-secondary/20">
          <CardBody className="p-6">
            <div className="flex items-start gap-3">
              <QrCodeIcon className="h-6 w-6 text-secondary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-secondary mb-2">
                  QR Code automatique
                </h4>
                <p className="text-sm text-default-600 leading-relaxed">
                  Une fois créée, cette page génèrera automatiquement un QR code
                  unique. Les visiteurs pourront scanner ce code pour accéder
                  directement au contenu de cette page sur leurs appareils
                  mobiles.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Mobile Actions */}
        <div className="flex gap-3 sm:hidden">
          <Button
            as={Link}
            href={`/admin/chalets/${chaletId}`}
            variant="bordered"
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            color="primary"
            onPress={() => handleSubmit()}
            isLoading={loading}
            isDisabled={
              !formData.title.trim() ||
              !formData.slug.trim() ||
              !formData.content.trim() ||
              formData.content === "<p></p>"
            }
            className="flex-1"
          >
            {loading ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
