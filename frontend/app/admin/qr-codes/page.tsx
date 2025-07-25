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
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsQrCode,
  BsSearch,
  BsDownload,
  BsEye,
  BsArrowRepeat,
} from "react-icons/bs";
import Link from "next/link";

import { getAllPages, regeneratePageQRCode } from "@/lib/services/pages";
import { getAllChalets } from "@/lib/services/chalets";
import { downloadQRCodesPDFAction } from "@/lib/actions/download";
import { Page, Chalet } from "@/types";

interface PageWithChalet extends Page {
  chaletName?: string;
}

export default function QRCodesManagement() {
  const [pages, setPages] = useState<PageWithChalet[]>([]);
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChalet, setSelectedChalet] = useState<string>("all");

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
        console.error("Erreur lors du chargement des QR codes:", error);
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.chaletName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChalet =
      selectedChalet === "all" ||
      (page.chalet &&
        (typeof page.chalet === "string" ? page.chalet : page.chalet._id) ===
          selectedChalet);

    return matchesSearch && matchesChalet;
  });

  const handleRegenerateQR = async (page: Page) => {
    try {
      await regeneratePageQRCode(page._id);
      // Refresh data
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

  const handleDownloadAllQRs = async (chaletId: string) => {
    try {
      const result = await downloadQRCodesPDFAction(chaletId);

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
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF:", error);
    }
  };

  const getQRCodeUrl = (page: Page) => {
    if (!page.chalet) return "";
    const chaletId =
      typeof page.chalet === "string" ? page.chalet : page.chalet._id;

    return `${window.location.origin}/chalets/${chaletId}/${page.slug}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des QR codes...</p>
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
            QR Codes
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez et téléchargez tous vos QR codes
          </p>
        </div>
      </motion.div>

      {/* Filtres */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardBody className="p-4">
            <div className="flex gap-4">
              <Input
                className="flex-1"
                classNames={{
                  input: "bg-transparent",
                  inputWrapper:
                    "border-border/50 hover:border-border focus-within:!border-primary",
                }}
                placeholder="Rechercher par titre ou chalet..."
                startContent={<BsSearch className="h-4 w-4" />}
                value={searchTerm}
                variant="bordered"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                className="w-64"
                classNames={{
                  trigger:
                    "border-border/50 hover:border-border focus:!border-primary",
                }}
                placeholder="Tous les chalets"
                selectedKeys={selectedChalet ? [selectedChalet] : []}
                variant="bordered"
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;

                  setSelectedChalet(value || "all");
                }}
              >
                <SelectItem key="all" value="all">
                  Tous les chalets
                </SelectItem>
                {chalets.map((chalet) => (
                  <SelectItem key={chalet._id} value={chalet._id}>
                    {chalet.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Actions rapides par chalet */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Export PDF par Chalet
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chalets.map((chalet) => {
                const chaletPages = pages.filter(
                  (page) =>
                    page.chalet &&
                    (typeof page.chalet === "string"
                      ? page.chalet
                      : page.chalet._id) === chalet._id,
                );

                return (
                  <Card key={chalet._id} className="border border-border/20">
                    <CardBody className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">
                          {chalet.name}
                        </h3>
                        <Chip color="primary" size="sm" variant="flat">
                          {chaletPages.length} QR
                        </Chip>
                      </div>
                      <Button
                        className="w-full"
                        color="primary"
                        isDisabled={chaletPages.length === 0}
                        startContent={<BsDownload className="h-4 w-4" />}
                        variant="flat"
                        onClick={() => handleDownloadAllQRs(chalet._id)}
                      >
                        Télécharger PDF
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Table des QR codes */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Tous les QR Codes ({filteredPages.length})
            </h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Table des QR codes" className="min-w-full">
              <TableHeader>
                <TableColumn>PAGE</TableColumn>
                <TableColumn>CHALET</TableColumn>
                <TableColumn>URL</TableColumn>
                <TableColumn>STATUT</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-warning/20">
                          <BsQrCode className="h-4 w-4 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {page.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            /{page.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip color="primary" size="sm" variant="flat">
                        {page.chaletName}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-mono text-muted-foreground truncate max-w-xs">
                        {getQRCodeUrl(page)}
                      </p>
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
                      <div className="flex gap-2">
                        <Button
                          as={Link}
                          color="primary"
                          href={getQRCodeUrl(page)}
                          size="sm"
                          startContent={<BsEye className="h-3 w-3" />}
                          target="_blank"
                          variant="flat"
                        >
                          Aperçu
                        </Button>
                        <Button
                          color="warning"
                          size="sm"
                          startContent={<BsArrowRepeat className="h-3 w-3" />}
                          variant="flat"
                          onClick={() => handleRegenerateQR(page)}
                        >
                          Régénérer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPages.length === 0 && !loading && (
              <div className="text-center py-8">
                <BsQrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || selectedChalet !== "all"
                    ? "Aucun QR code trouvé"
                    : "Aucun QR code généré"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedChalet !== "all"
                    ? "Essayez de modifier vos critères de recherche."
                    : "Les QR codes sont générés automatiquement lors de la création de pages."}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
