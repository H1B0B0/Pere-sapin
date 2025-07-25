"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsFileText,
  BsSearch,
  BsThreeDotsVertical,
  BsPencil,
  BsTrash,
  BsEye,
  BsQrCode,
} from "react-icons/bs";
import Link from "next/link";

import { getAllPages, deletePage, regeneratePageQRCode } from "@/lib/services/pages";
import { getAllChalets } from "@/lib/services/chalets";
import { Page, Chalet } from "@/types";

interface PageWithChalet extends Page {
  chaletName?: string;
}

export default function AllPagesManagement() {
  const [pages, setPages] = useState<PageWithChalet[]>([]);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pagesData, chaletsData] = await Promise.all([
          getAllPages(),
          getAllChalets(),
        ]);

        // Add chalet names to pages
        const pagesWithChalets: PageWithChalet[] = pagesData.map((page) => {
          const chalet = chaletsData.find((c) => {
            if (!page.chalet) return false;

            return (
              c._id ===
              (typeof page.chalet === "string" ? page.chalet : page.chalet._id)
            );
          });

          return {
            ...page,
            chaletName: chalet?.name || "Chalet inconnu",
          };
        });

        setPages(pagesWithChalets);
        setChalets(chaletsData);
      } catch (error) {
        console.error("Erreur lors du chargement des pages:", error);
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPages = pages.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.chaletName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTagColor = (tag: string) => {
    const colors = ["primary", "success", "warning", "secondary", "default"];
    const hash = tag.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);

      return a & a;
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  };

  const handleRegenerateQR = async (page: Page) => {
    try {
      await regeneratePageQRCode(page._id);
      // Refresh the page data
      const updatedPages = await getAllPages();
      const pagesWithChalets: PageWithChalet[] = updatedPages.map((p) => {
        const chalet = chalets.find(
          (c) =>
            c._id === (typeof p.chalet === "string" ? p.chalet : p.chalet._id),
        );

        return {
          ...p,
          chaletName: chalet?.name || "Chalet inconnu",
        };
      });

      setPages(pagesWithChalets);
    } catch (error) {
      console.error("Erreur lors de la régénération du QR code:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
            Toutes les Pages
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez toutes les pages explicatives de vos chalets
          </p>
        </div>
      </motion.div>

      {/* Recherche */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardBody className="p-4">
            <Input
              classNames={{
                input: "bg-transparent",
                inputWrapper:
                  "border-border/50 hover:border-border focus-within:!border-primary",
              }}
              placeholder="Rechercher par titre, chalet ou tag..."
              startContent={<BsSearch className="h-4 w-4" />}
              value={searchTerm}
              variant="bordered"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardBody>
        </Card>
      </motion.div>

      {/* Table des pages */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Pages ({filteredPages.length})
            </h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Table des pages" className="min-w-full">
              <TableHeader>
                <TableColumn>TITRE</TableColumn>
                <TableColumn>CHALET</TableColumn>
                <TableColumn>TAGS</TableColumn>
                <TableColumn>STATUT</TableColumn>
                <TableColumn>CRÉÉ LE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
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
                      <div className="flex items-center gap-2">
                        <Chip color="primary" size="sm" variant="flat">
                          {page.chaletName}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {page.tags?.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            color={getTagColor(tag) as any}
                            size="sm"
                            variant="flat"
                          >
                            {tag}
                          </Chip>
                        ))}
                        {page.tags && page.tags.length > 2 && (
                          <Chip color="default" size="sm" variant="flat">
                            +{page.tags.length - 2}
                          </Chip>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={page.isActive !== false ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                      >
                        {page.isActive !== false ? "Active" : "Inactive"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(page.createdAt)}
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
                            href={`/chalets/${page.chalet && (typeof page.chalet === "string" ? page.chalet : page.chalet._id)}/${page.slug}`}
                            startContent={<BsEye className="h-4 w-4" />}
                            target="_blank"
                          >
                            Aperçu
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            as={Link}
                            href={`/admin/chalets/${page.chalet && (typeof page.chalet === "string" ? page.chalet : page.chalet._id)}/pages/${page.slug}/edit`}
                            startContent={<BsPencil className="h-4 w-4" />}
                          >
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            key="qr"
                            startContent={<BsQrCode className="h-4 w-4" />}
                            onClick={() => handleRegenerateQR(page)}
                          >
                            Régénérer QR
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

            {filteredPages.length === 0 && !loading && (
              <div className="text-center py-8">
                <BsFileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? "Aucune page trouvée" : "Aucune page créée"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Essayez de modifier vos critères de recherche."
                    : "Créez votre première page explicative depuis un chalet."}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
