"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Chip as Badge } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { useAuthStore } from "@/lib/auth-store";
import { useToast } from "@/hooks/use-toast";
import { Chalet, Page, CreatePageDto } from "@/types";
import { RichEditor } from "@/components/ui/rich-editor";
import Link from "next/link";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

export default function ChaletDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, initialized } = useAuthStore();
  const { showSuccess, showError } = useToast();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreatePageDto>({
    title: "",
    content: "",
    slug: "",
    chalet: params.id as string,
  });

  const chaletId = params.id as string;

  useEffect(() => {
    if (initialized && !user) {
      router.push("/admin/login");
    }
  }, [user, initialized, router]);

  useEffect(() => {
    if (user && chaletId) {
      fetchData();
    }
  }, [user, chaletId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [chaletData, pagesData] = await Promise.all([
        chaletService.getById(chaletId),
        pageService.getByChaletId(chaletId),
      ]);
      setChalet(chaletData);
      setPages(pagesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showError("Erreur", "Impossible de charger les données du chalet");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    try {
      // Générer un slug automatiquement si pas rempli
      if (!formData.slug) {
        const chaletSlug =
          chalet?.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || "";

        const titleSlug = formData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // Remove accents
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");

        formData.slug = `${chaletSlug}-${titleSlug}`;
      }

      await pageService.create(formData);
      setFormData({
        title: "",
        content: "",
        slug: "",
        chalet: chaletId,
      });
      onOpenChange(); // Fermer le modal
      fetchData(); // Refresh data
      showSuccess("Page créée", "La page a été créée avec succès");
    } catch (error) {
      console.error("Error creating page:", error);
      showError("Erreur", "Impossible de créer la page");
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette page ?")) {
      try {
        await pageService.delete(pageId);
        fetchData(); // Refresh data
        showSuccess("Page supprimée", "La page a été supprimée avec succès");
      } catch (error) {
        console.error("Error deleting page:", error);
        showError("Erreur", "Impossible de supprimer la page");
      }
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const pdfBlob = await chaletService.downloadQRCodesPDF(chaletId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcodes-${chalet?.name || chaletId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showSuccess(
        "PDF téléchargé",
        "Le fichier PDF des QR codes a été téléchargé"
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
      showError("Erreur", "Impossible de télécharger le PDF");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardBody>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2 mt-2" />
                <div className="mt-4">
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="text-center">
        <p>Le chalet est introuvable.</p>
        <Button
          as={Link}
          href="/admin"
          variant="bordered"
          className="mt-4"
          startContent={<ArrowLeftIcon className="h-4 w-4" />}
        >
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          as={Link}
          href="/admin"
          variant="bordered"
          startContent={<ArrowLeftIcon className="h-4 w-4" />}
        >
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Chalet : {chalet.name}</h1>
        <div className="flex gap-2">
          <Button
            onPress={handleDownloadPdf}
            variant="bordered"
            startContent={<DocumentArrowDownIcon className="h-4 w-4" />}
          >
            PDF QR Codes
          </Button>
          <Button
            onPress={onOpen}
            color="primary"
            startContent={<PlusIcon className="h-4 w-4" />}
          >
            Nouvelle Page
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3>Créer une nouvelle page</h3>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Titre de la page"
                    placeholder="Entrez le titre"
                    value={formData.title}
                    onValueChange={(value) =>
                      setFormData({ ...formData, title: value })
                    }
                  />
                  <Input
                    label="Slug (URL)"
                    placeholder="Ex: informations-pratiques"
                    description="Laissez vide pour générer automatiquement depuis le titre"
                    value={formData.slug}
                    onValueChange={(value) =>
                      setFormData({ ...formData, slug: value })
                    }
                  />
                  <RichEditor
                    content={formData.content}
                    onChange={(value) =>
                      setFormData({ ...formData, content: value })
                    }
                    placeholder="Contenu de la page (HTML riche)"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button color="primary" onPress={handleCreatePage}>
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => (
          <Card key={page._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold truncate">{page.title}</h3>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="light" size="sm" isIconOnly>
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownItem
                      key="view"
                      as={Link}
                      href={`/page/${page.slug}`}
                      target="_blank"
                      startContent={<EyeIcon className="h-4 w-4" />}
                    >
                      Voir
                    </DropdownItem>
                    <DropdownItem
                      key="edit"
                      as={Link}
                      href={`/admin/chalets/${chaletId}/pages/${page._id}`}
                      startContent={<PencilIcon className="h-4 w-4" />}
                    >
                      Modifier
                    </DropdownItem>
                    <DropdownItem
                      key="delete"
                      onPress={() => handleDeletePage(page._id)}
                      startContent={<TrashIcon className="h-4 w-4" />}
                      className="text-danger"
                      color="danger"
                    >
                      Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-default-500 line-clamp-3">
                {page.content.substring(0, 100)}...
              </p>
              <div className="flex justify-between items-center mt-4">
                <Badge variant="flat" color="secondary">
                  <DocumentTextIcon className="mr-1 h-3 w-3" />
                  Page
                </Badge>
                <Button
                  variant="bordered"
                  size="sm"
                  as={Link}
                  href={`/admin/chalets/${chaletId}/pages/${page._id}?showQr=true`}
                  startContent={<QrCodeIcon className="h-4 w-4" />}
                >
                  QR Code
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
