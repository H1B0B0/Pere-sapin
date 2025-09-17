"use client";

import { useState } from "react";
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

import { Page, Chalet } from "@/types";
import { regeneratePageQRCodeClient } from "@/lib/services/client-pages";
import { downloadChaletQRCodesPDFClient } from "@/lib/services/client-chalets";

interface PageWithChalet extends Page {
  chaletName?: string;
}

interface Props {
  initialPages: PageWithChalet[];
  initialChalets: Chalet[];
}

export default function QRCodesManagementClient({
  initialPages,
  initialChalets,
}: Props) {
  const [pages, setPages] = useState<PageWithChalet[]>(initialPages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChalet, setSelectedChalet] = useState<string>("all");
  const [downloading, setDownloading] = useState<string | null>(null);

  // Filter pages based on search and chalet selection
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.chaletName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChalet =
      selectedChalet === "all" ||
      (typeof page.chalet === "string"
        ? page.chalet === selectedChalet
        : page.chalet?._id === selectedChalet);

    return matchesSearch && matchesChalet;
  });

  const handleRegenerateQRCode = async (pageId: string) => {
    try {
      const updatedPage = await regeneratePageQRCodeClient(pageId);

      setPages((prev) =>
        prev.map((p) =>
          p._id === pageId ? { ...updatedPage, chaletName: p.chaletName } : p,
        ),
      );
    } catch (error) {
      console.error("Erreur lors de la régénération du QR code:", error);
    }
  };

  const handleDownloadChaletQRCodes = async (
    chaletId: string,
    chaletName: string,
  ) => {
    try {
      setDownloading(chaletId);
      const blob = await downloadChaletQRCodesPDFClient(chaletId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.style.display = "none";
      a.href = url;
      a.download = `qr-codes-${chaletName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BsQrCode className="text-2xl text-secondary" />
              <h1 className="text-2xl font-bold">Gestion des QR Codes</h1>
            </div>
          </CardHeader>
          <CardBody>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <Input
                className="max-w-xs"
                placeholder="Rechercher..."
                startContent={<BsSearch />}
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <div className="flex flex-col gap-2 max-w-xs">
                <label className="text-sm font-medium">Chalet</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedChalet}
                  onChange={(e) => setSelectedChalet(e.target.value || "all")}
                >
                  <option value="all">Tous les chalets</option>
                  {initialChalets.map((chalet) => (
                    <option key={chalet._id} value={chalet._id}>
                      {chalet.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick actions for chalets */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Téléchargements groupés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialChalets.map((chalet) => {
                  const chaletPages = pages.filter((p) =>
                    typeof p.chalet === "string"
                      ? p.chalet === chalet._id
                      : p.chalet?._id === chalet._id,
                  );

                  return (
                    <Card key={chalet._id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{chalet.name}</h4>
                          <p className="text-sm text-gray-500">
                            {chaletPages.length} QR code(s)
                          </p>
                        </div>
                        <Button
                          color="secondary"
                          isDisabled={chaletPages.length === 0}
                          isLoading={downloading === chalet._id}
                          size="sm"
                          startContent={<BsDownload />}
                          onPress={() =>
                            handleDownloadChaletQRCodes(chalet._id, chalet.name)
                          }
                        >
                          PDF
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Table */}
            <Table aria-label="QR Codes table">
              <TableHeader>
                <TableColumn>PAGE</TableColumn>
                <TableColumn>CHALET</TableColumn>
                <TableColumn>QR CODE</TableColumn>
                <TableColumn>VUES</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Aucun QR code trouvé">
                {filteredPages.map((page) => (
                  <TableRow key={page._id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{page.title}</p>
                        <p className="text-sm text-gray-500">/{page.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip color="primary" size="sm" variant="flat">
                        {page.chaletName || "Non assigné"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BsQrCode className="text-secondary" />
                        <span className="text-sm">Généré</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BsEye className="text-gray-400" />
                        <span>{page.views || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          as={Link}
                          href={`/chalets/${typeof page.chalet === "string" ? page.chalet : page.chalet?._id}/${page.slug}`}
                          size="sm"
                          startContent={<BsEye />}
                          target="_blank"
                          variant="flat"
                        >
                          Voir
                        </Button>
                        <Button
                          color="secondary"
                          size="sm"
                          startContent={<BsArrowRepeat />}
                          variant="flat"
                          onPress={() => handleRegenerateQRCode(page._id)}
                        >
                          Régénérer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
