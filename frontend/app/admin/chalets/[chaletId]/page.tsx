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
} from "react-icons/bs";
import Link from "next/link";

import { getChaletById } from "@/lib/services/chalets";
import { getPagesByChaletId } from "@/lib/services/pages";
import { downloadQRCodesPDFAction } from "@/lib/actions/download";
import { Chalet, Page } from "@/types";

export default function ChaletDetail() {
  const params = useParams();
  const router = useRouter();
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

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
          error,
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
            <div className="p-4 rounded-full bg-primary/20">
              <BsTree className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
                {chalet.name}
              </h1>
              <p className="text-muted-foreground mt-1">{chalet.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Créé le {formatDate(chalet.createdAt)}
              </p>
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
                          {page.description}
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
    </div>
  );
}
