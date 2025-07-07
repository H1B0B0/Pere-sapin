"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, Page, UpdatePageDto } from "@/types";
import Link from "next/link";
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { RichEditor } from "@/components/ui/rich-editor";
import { RichContent } from "@/components/ui/rich-content";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const chaletId = params.id as string;
  const pageId = params.pageId as string;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdatePageDto>({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<Partial<UpdatePageDto>>({});

  useEffect(() => {
    if (chaletId && pageId) {
      fetchData();
    }
  }, [chaletId, pageId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pageData, chaletData] = await Promise.all([
        pageService.getById(pageId),
        chaletService.getById(chaletId),
      ]);
      setPage(pageData);
      setChalet(chaletData);
      setFormData({
        title: pageData.title,
        content: pageData.content,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      router.push(`/admin/chalets/${chaletId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) {
      setErrors((prev) => ({ ...prev, content: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<UpdatePageDto> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre de la page est requis";
    }

    if (!formData.content.trim() || formData.content === "<p></p>") {
      newErrors.content = "Le contenu de la page est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!page || !validateForm()) return;

    try {
      setSaving(true);
      await pageService.update(page._id, formData);
      await fetchData();
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating page:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!page) return;

    try {
      setDeleting(true);
      await pageService.delete(page._id);
      router.push(`/admin/chalets/${chaletId}`);
    } catch (error) {
      console.error("Error deleting page:", error);
    } finally {
      setDeleting(false);
      onClose();
    }
  };

  const handleDownloadQR = () => {
    if (!page) return;
    // Implement QR code download functionality
    console.log("Download QR code for page:", page.slug);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      title: page?.title || "",
      content: page?.content || "",
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-8 bg-default-200 rounded animate-pulse" />
          <div className="h-4 bg-default-100 rounded animate-pulse w-1/2" />
        </div>
        <div className="h-96 bg-default-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!page || !chalet) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-default-400 mb-4" />
        <h3 className="text-lg font-medium text-default-600 mb-2">
          Page non trouvée
        </h3>
        <p className="text-default-500 mb-6">
          La page demandée n'existe pas ou n'est plus disponible.
        </p>
        <Button
          as={Link}
          href={`/admin/chalets/${chaletId}`}
          color="primary"
          variant="flat"
        >
          Retour au chalet
        </Button>
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
                {isEditing ? "Modifier la page" : page.title}
              </h1>
              <div className="flex items-center gap-2 text-default-600 flex-wrap">
                <span className="font-medium text-primary">{chalet.name}</span>
                <span className="hidden sm:inline">•</span>
                <span className="text-sm">
                  Créée le{" "}
                  {new Date(page.createdAt).toLocaleDateString("fr-FR")}
                </span>
                <Chip
                  variant="flat"
                  color={page.isActive ? "success" : "default"}
                  size="sm"
                >
                  {page.isActive ? "Active" : "Inactive"}
                </Chip>
              </div>
            </div>
          </div>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              as={Link}
              href={`/page/${page.slug}`}
              target="_blank"
              variant="bordered"
              startContent={<EyeIcon className="h-4 w-4" />}
              size="sm"
            >
              Voir
            </Button>
            <Button
              variant="bordered"
              startContent={<QrCodeIcon className="h-4 w-4" />}
              onPress={handleDownloadQR}
              size="sm"
            >
              QR Code
            </Button>
            <Button
              color="primary"
              startContent={<PencilIcon className="h-4 w-4" />}
              onPress={() => setIsEditing(true)}
              size="sm"
            >
              Modifier
            </Button>
            <Button
              color="danger"
              variant="bordered"
              startContent={<TrashIcon className="h-4 w-4" />}
              onPress={onOpen}
              size="sm"
            >
              Supprimer
            </Button>
          </div>
        )}

        {isEditing && (
          <div className="flex items-center gap-3">
            <Button
              variant="bordered"
              startContent={<XMarkIcon className="h-4 w-4" />}
              onPress={handleCancel}
              size="sm"
            >
              Annuler
            </Button>
            <Button
              color="primary"
              startContent={<CheckIcon className="h-4 w-4" />}
              onPress={handleUpdate}
              isLoading={saving}
              isDisabled={
                !formData.title.trim() ||
                !formData.content.trim() ||
                formData.content === "<p></p>"
              }
              size="sm"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="grid gap-6">
          {/* Title */}
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="p-6">
              <Input
                label="Titre de la page"
                placeholder="Entrez le titre de votre page..."
                value={formData.title}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, title: value }));
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
                    Modifiez le contenu de votre page avec l'éditeur riche.
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
                placeholder="Commencez à écrire le contenu de votre page..."
              />
            </CardBody>
          </Card>

          {/* Mobile Actions */}
          <div className="flex gap-3 sm:hidden">
            <Button
              variant="bordered"
              startContent={<XMarkIcon className="h-4 w-4" />}
              onPress={handleCancel}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              color="primary"
              startContent={<CheckIcon className="h-4 w-4" />}
              onPress={handleUpdate}
              isLoading={saving}
              isDisabled={
                !formData.title.trim() ||
                !formData.content.trim() ||
                formData.content === "<p></p>"
              }
              className="flex-1"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </div>
        </div>
      ) : (
        <Card className="border border-default-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Contenu de la page</h3>
                <p className="text-sm text-default-600 mt-1">
                  Prévisualisation du contenu tel qu'il apparaîtra aux
                  visiteurs.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="bg-default-50/50 rounded-xl p-6 border border-default-200">
              <RichContent content={page.content} />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Confirmer la suppression</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-3">
              <p className="text-default-600">
                Êtes-vous sûr de vouloir supprimer la page{" "}
                <span className="font-semibold text-foreground">
                  "{page.title}"
                </span>{" "}
                ?
              </p>
              <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-700 text-sm font-medium">
                  ⚠️ Cette action est irréversible
                </p>
                <p className="text-danger-600 text-sm mt-1">
                  La page, son contenu et son QR code seront définitivement
                  supprimés.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onClose}>
              Annuler
            </Button>
            <Button
              color="danger"
              isLoading={deleting}
              onPress={handleDelete}
              startContent={
                !deleting ? <TrashIcon className="h-4 w-4" /> : undefined
              }
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
