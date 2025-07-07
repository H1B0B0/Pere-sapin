"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Chip } from "@heroui/chip";
import { Spacer } from "@heroui/spacer";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { useAuthStore } from "@/lib/auth-store";
import { Chalet, CreateChaletDto, Page } from "@/types";
import Link from "next/link";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  DocumentArrowDownIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreateChaletDto>({
    name: "",
    description: "",
  });

  useEffect(() => {
    console.log("🔍 Dashboard: Auth state", { user: !!user, initialized });
    if (!initialized) {
      console.log("⏳ Dashboard: Auth not initialized yet");
      return;
    }

    if (!user) {
      console.log("❌ Dashboard: No user, redirecting to login");
      router.push("/admin/login");
      return;
    }

    console.log("✅ Dashboard: User authenticated, fetching data");
    fetchData();
  }, [user, initialized, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching data...");
      const [chaletsData, pagesData] = await Promise.all([
        chaletService.getAll(),
        pageService.getAll(),
      ]);
      console.log("✅ Data fetched:", { chaletsData, pagesData });
      setChalets(chaletsData);
      setPages(pagesData);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChalet = async () => {
    try {
      await chaletService.create(formData);
      setFormData({ name: "", description: "" });
      onClose();
      fetchData();
    } catch (error) {
      console.error("Error creating chalet:", error);
    }
  };

  const handleDeleteChalet = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce chalet ?")) {
      try {
        await chaletService.delete(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting chalet:", error);
      }
    }
  };

  const getPageCount = (chaletId: string) => {
    return pages.filter((page) =>
      typeof page.chalet === "string"
        ? page.chalet === chaletId
        : page.chalet._id === chaletId
    ).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardBody>
                <div className="h-20 bg-default-200 rounded" />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Tableau de bord
          </h1>
          <p className="text-default-600">
            Gérez vos chalets et leurs pages QR en toute simplicité
          </p>
        </div>
        <Button
          color="primary"
          startContent={<PlusIcon className="h-4 w-4" />}
          onPress={onOpen}
          size="lg"
          className="min-w-32"
        >
          <span className="hidden sm:inline">Nouveau chalet</span>
          <span className="sm:hidden">Nouveau</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border border-default-200 shadow-sm hover:shadow-md transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BuildingOfficeIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-default-500 mb-1">
                  Chalets
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {chalets.length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-200 shadow-sm hover:shadow-md transition-shadow">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl">
                <DocumentTextIcon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-default-500 mb-1">
                  Pages totales
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {pages.length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-default-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl">
                <QrCodeIcon className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-default-500 mb-1">
                  QR Codes actifs
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {pages.filter((p) => p.isActive).length}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Chalets List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">Vos chalets</h2>
          {chalets.length > 0 && (
            <p className="text-sm text-default-600">
              {chalets.length} chalet{chalets.length > 1 ? "s" : ""} •{" "}
              {pages.length} page{pages.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {chalets.length === 0 ? (
          <Card className="border border-default-200 shadow-sm">
            <CardBody className="text-center py-16">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <BuildingOfficeIcon className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Aucun chalet trouvé
                  </h3>
                  <p className="text-default-600 max-w-md mx-auto">
                    Commencez par créer votre premier chalet pour générer des QR
                    codes et partager vos informations avec vos invités.
                  </p>
                </div>
                <Button
                  color="primary"
                  startContent={<PlusIcon className="h-5 w-5" />}
                  onPress={onOpen}
                  size="lg"
                >
                  Créer mon premier chalet
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid gap-4">
            {chalets.map((chalet) => (
              <Card
                key={chalet._id}
                className="border border-default-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/30"
              >
                <CardBody className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Chalet Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          {chalet.name}
                        </h3>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={
                            getPageCount(chalet._id) > 0 ? "primary" : "default"
                          }
                        >
                          {getPageCount(chalet._id)} page
                          {getPageCount(chalet._id) > 1 ? "s" : ""}
                        </Chip>
                      </div>

                      {chalet.description && (
                        <p className="text-default-600 line-clamp-2">
                          {chalet.description}
                        </p>
                      )}

                      <p className="text-sm text-default-500">
                        Créé le{" "}
                        {new Date(chalet.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 lg:flex-nowrap lg:flex-col lg:w-auto">
                      <div className="flex gap-2 flex-1 lg:flex-none">
                        <Button
                          as={Link}
                          href={`/admin/chalets/${chalet._id}`}
                          variant="bordered"
                          size="sm"
                          startContent={<EyeIcon className="h-4 w-4" />}
                          className="flex-1 lg:flex-none"
                        >
                          <span className="hidden sm:inline">Voir détails</span>
                          <span className="sm:hidden">Voir</span>
                        </Button>
                        <Button
                          as={Link}
                          href={`/admin/chalets/${chalet._id}/pages/new`}
                          color="primary"
                          variant="bordered"
                          size="sm"
                          startContent={<PlusIcon className="h-4 w-4" />}
                          className="flex-1 lg:flex-none"
                        >
                          <span className="hidden sm:inline">
                            Nouvelle page
                          </span>
                          <span className="sm:hidden">Ajouter</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Chalet Modal */}
      <Modal isOpen={isOpen} onClose={onClose} placement="center" size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Créer un nouveau chalet</h3>
            <p className="text-sm text-default-600 font-normal">
              Ajoutez un nouveau chalet pour commencer à créer des pages QR.
            </p>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-4">
              <Input
                label="Nom du chalet"
                placeholder="Ex: Chalet des Alpes, Villa Montagne..."
                value={formData.name}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, name: value })
                }
                isRequired
                variant="bordered"
                size="lg"
                classNames={{
                  inputWrapper: "border-2 focus-within:border-primary",
                }}
              />
              <Input
                label="Description (optionnelle)"
                placeholder="Décrivez brièvement votre chalet..."
                value={formData.description}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, description: value })
                }
                variant="bordered"
                size="lg"
                classNames={{
                  inputWrapper: "border-2 focus-within:border-primary",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="bordered" onPress={onClose} size="lg">
              Annuler
            </Button>
            <Button
              color="primary"
              onPress={handleCreateChalet}
              isDisabled={!formData.name.trim()}
              size="lg"
              className="min-w-32"
            >
              Créer le chalet
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
