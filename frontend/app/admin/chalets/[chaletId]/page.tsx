"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsTree,
  BsPlus,
  BsPencil,
  BsTrash,
  BsEye,
  BsQrCode,
  BsDownload,
  BsThreeDotsVertical,
  BsArrowLeft,
  BsCalendar,
} from "react-icons/bs";
import Link from "next/link";

import { getChaletById } from "@/lib/services/chalets";
import { getPagesByChaletId } from "@/lib/services/pages";
import { downloadQRCodesPDFAction } from "@/lib/actions/download";
import { deleteChaletAction } from "@/lib/actions/chalets";
import { Chalet, Page } from "@/types";
import { CHALET_COLORS } from "@/config/colors";
import { CHALET_ICONS } from "@/config/icons";

export default function ChaletDetail() {
  const params = useParams();
  const router = useRouter();
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getColorHex = (name?: string) =>
    CHALET_COLORS.find((c) => c.name === name)?.value;

  const getIconComponent = (id?: string) => {
    const it = CHALET_ICONS.find((i) => i.id === id);
    return it ? it.icon : BsTree;
  };

  useEffect(() => {
    const fetchChaletData = async () => {
      try {
        setLoading(true);
        const chaletId = params.chaletId as string;

        const [chaletData, pagesData] = await Promise.all([
          getChaletById(chaletId),
          getPagesByChaletId(chaletId),
        ]);

        setChalet(chaletData);
        setPages(pagesData);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du chalet:",
          error
        );
        setChalet(null);
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChaletData();
  }, [params.chaletId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTagColor = (tag: string) => {
    const colors = {
      Extérieur: "success",
      Intérieur: "primary",
      Sécurité: "warning",
      Chauffage: "danger",
      Technologie: "secondary",
      Divertissement: "default",
    };

    return colors[tag as keyof typeof colors] || "default";
  };

  const handleDeleteChalet = async () => {
    if (!chalet) return;

    try {
      await deleteChaletAction(chalet._id);
      router.push("/admin/chalets");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du chalet...</p>
        </div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Chalet introuvable
        </h2>
        <p className="text-muted-foreground mb-6">
          Le chalet demandé n&apos;existe pas ou a été supprimé.
        </p>
        <Link href="/admin/chalets">
          <Button color="primary">Retour aux chalets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/chalets">
            <Button
              startContent={<BsArrowLeft className="h-4 w-4" />}
              variant="light"
            >
              Retour
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* dynamic color + icon preview */}
            {(() => {
              const colorHex = getColorHex(chalet.color || undefined);
              const IconComp = getIconComponent(chalet.icon || undefined);

              return (
                <div
                  className="p-4 rounded-full"
                  style={
                    colorHex
                      ? { backgroundColor: `${colorHex}33` } // light background using 8-digit hex alpha
                      : undefined
                  }
                >
                  <IconComp
                    className="h-8 w-8"
                    style={colorHex ? { color: colorHex } : undefined}
                  />
                </div>
              );
            })()}
            <div>
              <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
                {chalet.name}
              </h1>
              <p className="text-muted-foreground mt-1">{chalet.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Créé le {formatDate(chalet.createdAt)}
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {chalet.rooms && (
                  <Chip size="sm" variant="flat">
                    {chalet.rooms}
                  </Chip>
                )}
                {chalet.bedrooms && (
                  <Chip color="primary" size="sm" variant="flat">
                    Chambres détaillées
                  </Chip>
                )}
                {chalet.bathrooms && (
                  <Chip color="secondary" size="sm" variant="flat">
                    Salles de bain
                  </Chip>
                )}
                {chalet.color && (
                  <Chip color="success" size="sm" variant="flat">
                    Couleur: {chalet.color}
                  </Chip>
                )}
                {chalet.icon && (
                  <Chip color="warning" size="sm" variant="flat">
                    Icône: {chalet.icon}
                  </Chip>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/admin/chalets/${chalet._id}/edit`}>
              <Button
                color="primary"
                startContent={<BsPencil className="h-4 w-4" />}
                variant="flat"
              >
                Modifier
              </Button>
            </Link>
            <Link href={`/admin/chalets/${chalet._id}/calendar`}>
              <Button
                color="secondary"
                startContent={<BsCalendar className="h-4 w-4" />}
                variant="flat"
              >
                Calendrier
              </Button>
            </Link>
            <Button
              className="btn-success text-primary-foreground"
              color="success"
              startContent={<BsDownload className="h-4 w-4" />}
              onClick={async () => {
                const result = await downloadQRCodesPDFAction(chalet._id);

                if (result.success && result.data && result.filename) {
                  const binaryString = atob(result.data);
                  const bytes = new Uint8Array(binaryString.length);

                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  const blob = new Blob([bytes], {
                    type: result.contentType,
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");

                  a.href = url;
                  a.download = result.filename;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
            >
              Export PDF
            </Button>
            <Button
              color="danger"
              startContent={<BsTrash className="h-4 w-4" />}
              variant="flat"
              onPress={onOpen}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-success/20">
              <BsEye className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pages.length}
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
                {pages.length}
              </p>
              <p className="text-sm text-muted-foreground">QR Codes</p>
            </div>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-primary/20">
              <BsEye className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pages.reduce((sum, page) => sum + (page.views || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Vues totales</p>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Pages du chalet */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Informations structure
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {chalet.bedrooms && (
                <div>
                  <p className="font-medium mb-1">Chambres</p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {chalet.bedrooms}
                  </p>
                </div>
              )}
              {chalet.bathrooms && (
                <div>
                  <p className="font-medium mb-1">Salles de bain / WC</p>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {chalet.bathrooms}
                  </p>
                </div>
              )}
              {chalet.prices && (
                <div className="md:col-span-2">
                  <p className="font-medium mb-2">Tarifs</p>
                  <div className="flex flex-wrap gap-2">
                    {chalet.prices.weekend && (
                      <Chip color="primary" size="sm" variant="flat">
                        Week-end: {chalet.prices.weekend}
                      </Chip>
                    )}
                    {chalet.prices.week && (
                      <Chip color="success" size="sm" variant="flat">
                        Semaine: {chalet.prices.week}
                      </Chip>
                    )}
                    {chalet.prices.holidays && (
                      <Chip color="warning" size="sm" variant="flat">
                        Vacances: {chalet.prices.holidays}
                      </Chip>
                    )}
                    {chalet.prices.cleaning && (
                      <Chip color="secondary" size="sm" variant="flat">
                        Ménage: {chalet.prices.cleaning}
                      </Chip>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.18 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Caractéristiques & Points forts
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chalet.features && chalet.features.length > 0 && (
                <div>
                  <p className="font-medium mb-2 text-sm">Caractéristiques</p>
                  <div className="flex flex-wrap gap-2">
                    {chalet.features.map((f) => (
                      <Chip key={f} size="sm" variant="flat">
                        {f}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
              {chalet.highlights && chalet.highlights.length > 0 && (
                <div>
                  <p className="font-medium mb-2 text-sm">Points forts</p>
                  <div className="flex flex-wrap gap-2">
                    {chalet.highlights.map((h) => (
                      <Chip key={h} color="success" size="sm" variant="flat">
                        {h}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold text-foreground">
                Pages explicatives ({pages.length})
              </h2>
              <Link href={`/admin/chalets/${chalet._id}/pages/new`}>
                <Button
                  className="btn-alpine text-primary-foreground"
                  color="primary"
                  startContent={<BsPlus className="h-4 w-4" />}
                >
                  Nouvelle Page
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {pages.length > 0 ? (
              <Table aria-label="Pages du chalet" className="min-w-full">
                <TableHeader>
                  <TableColumn>TITRE</TableColumn>
                  <TableColumn>DESCRIPTION</TableColumn>
                  <TableColumn>TAGS</TableColumn>
                  <TableColumn>VUES</TableColumn>
                  <TableColumn>MODIFIÉ LE</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">
                            {page.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            /{page.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground max-w-xs truncate">
                          {page.content.slice(0, 100)}...
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {page.tags.map((tag) => (
                            <Chip
                              key={tag}
                              color={getTagColor(tag) as any}
                              size="sm"
                              variant="flat"
                            >
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip color="secondary" size="sm" variant="flat">
                          {page.views || 0}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(page.updatedAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              size="sm"
                              startContent={
                                <BsThreeDotsVertical className="h-4 w-4" />
                              }
                              variant="light"
                            />
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="view"
                              as={Link}
                              href={`/chalets/${chalet._id}/${page.slug}`}
                              startContent={<BsEye className="h-4 w-4" />}
                              target="_blank"
                            >
                              Aperçu
                            </DropdownItem>
                            <DropdownItem
                              key="edit"
                              as={Link}
                              href={`/admin/chalets/${chalet._id}/pages/${page.slug}/edit`}
                              startContent={<BsPencil className="h-4 w-4" />}
                            >
                              Modifier
                            </DropdownItem>
                            <DropdownItem
                              key="qr"
                              startContent={<BsQrCode className="h-4 w-4" />}
                            >
                              QR Code
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              color="danger"
                              startContent={<BsTrash className="h-4 w-4" />}
                            >
                              Supprimer
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <BsEye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucune page créée
                </h3>
                <p className="text-muted-foreground mb-6">
                  Commencez par créer votre première page explicative pour ce
                  chalet.
                </p>
                <Link href={`/admin/chalets/${chalet._id}/pages/new`}>
                  <Button
                    className="btn-alpine text-primary-foreground"
                    color="primary"
                    startContent={<BsPlus className="h-4 w-4" />}
                  >
                    Créer une page
                  </Button>
                </Link>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Modal de confirmation de suppression */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmer la suppression
              </ModalHeader>
              <ModalBody>
                <p>
                  Êtes-vous sûr de vouloir supprimer le chalet "{chalet?.name}"
                  ? Cette action est irréversible.
                </p>
                {pages.length > 0 && (
                  <p className="text-warning text-sm">
                    Attention : Ce chalet contient {pages.length} page(s) qui
                    seront également supprimées.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleDeleteChalet();
                    onClose();
                  }}
                >
                  Supprimer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
