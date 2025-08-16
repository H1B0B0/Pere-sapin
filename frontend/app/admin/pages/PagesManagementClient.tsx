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

import { Page, Chalet } from "@/types";
import { regeneratePageQRCodeClient } from "@/lib/services/client-pages";

interface PageWithChalet extends Page {
  chaletName?: string;
}

interface Props {
  initialPages: PageWithChalet[];
  initialChalets: Chalet[];
}

export default function PagesManagementClient({
  initialPages,
  initialChalets,
}: Props) {
  const [pages, setPages] = useState<PageWithChalet[]>(initialPages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChalet, setSelectedChalet] = useState<string>("all");

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
              <BsFileText className="text-2xl text-primary" />
              <h1 className="text-2xl font-bold">Gestion des Pages</h1>
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
              <select
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                value={selectedChalet}
                onChange={(e) => setSelectedChalet(e.target.value)}
              >
                <option value="all">Tous les chalets</option>
                {initialChalets.map((chalet) => (
                  <option key={chalet._id} value={chalet._id}>
                    {chalet.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <Table aria-label="Pages table">
              <TableHeader>
                <TableColumn>TITRE</TableColumn>
                <TableColumn>CHALET</TableColumn>
                <TableColumn>SLUG</TableColumn>
                <TableColumn>VUES</TableColumn>
                <TableColumn>CRÉÉ LE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Aucune page trouvée">
                {filteredPages.map((page) => (
                  <TableRow key={page._id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{page.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-48">
                          {page.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip color="primary" size="sm" variant="flat">
                        {page.chaletName || "Non assigné"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {page.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BsEye className="text-gray-400" />
                        <span>{page.views || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(page.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light">
                            <BsThreeDotsVertical />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                          <DropdownItem
                            key="view"
                            as={Link}
                            href={`/chalets/${typeof page.chalet === "string" ? page.chalet : page.chalet?._id}/${page.slug}`}
                            startContent={<BsEye />}
                            target="_blank"
                          >
                            Voir la page
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            as={Link}
                            href={`/admin/chalets/${typeof page.chalet === "string" ? page.chalet : page.chalet?._id}/pages/${page.slug}/edit`}
                            startContent={<BsPencil />}
                          >
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            key="qrcode"
                            startContent={<BsQrCode />}
                            onPress={() => handleRegenerateQRCode(page._id)}
                          >
                            Régénérer QR Code
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<BsTrash />}
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
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
