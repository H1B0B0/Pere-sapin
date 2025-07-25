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
  BsThreeDotsVertical,
  BsPencil,
  BsTrash,
  BsEye,
  BsQrCode,
} from "react-icons/bs";
import Link from "next/link";

import { getAllChalets, deleteChalet } from "@/lib/services/chalets";
import { getAllPages } from "@/lib/services/pages";
import { Chalet } from "@/types";

interface ChaletWithPages extends Chalet {
  pagesCount: number;
}

export default function ChaletsManagement() {
  const [chalets, setChalets] = useState<ChaletWithPages[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChalet, setSelectedChalet] = useState<ChaletWithPages | null>(
    null,
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchChalets = async () => {
      try {
        setLoading(true);
        const [chaletsData, allPages] = await Promise.all([
          getAllChalets(),
          getAllPages(),
        ]);

        // Add page count to each chalet
        const chaletsWithPages: ChaletWithPages[] = chaletsData.map(
          (chalet) => ({
            ...chalet,
            pagesCount: allPages.filter((page) => {
              if (!page.chalet) return false;

              return typeof page.chalet === "string"
                ? page.chalet === chalet._id
                : page.chalet._id === chalet._id;
            }).length,
          }),
        );

        setChalets(chaletsWithPages);
      } catch (error) {
        console.error("Erreur lors du chargement des chalets:", error);
        setChalets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChalets();
  }, []);

  const handleDeleteChalet = async (chalet: ChaletWithPages) => {
    try {
      await deleteChalet(chalet._id);
      setChalets((prev) => prev.filter((c) => c._id !== chalet._id));
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des chalets...</p>
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
            Gestion des Chalets
          </h1>
          <p className="text-muted-foreground mt-2">
            Créez et gérez vos chalets et leurs pages explicatives
          </p>
        </div>
        <Link href="/admin/chalets/new">
          <Button
            className="btn-alpine text-primary-foreground"
            color="primary"
            startContent={<BsPlus className="h-4 w-4" />}
          >
            Nouveau Chalet
          </Button>
        </Link>
      </motion.div>

      {/* Table des chalets */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Tous les chalets ({chalets.length})
            </h2>
          </CardHeader>
          <CardBody>
            <Table aria-label="Table des chalets" className="min-w-full">
              <TableHeader>
                <TableColumn>NOM</TableColumn>
                <TableColumn>DESCRIPTION</TableColumn>
                <TableColumn>PAGES</TableColumn>
                <TableColumn>CRÉÉ LE</TableColumn>
                <TableColumn>MODIFIÉ LE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {chalets.map((chalet) => (
                  <TableRow key={chalet._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/20">
                          <BsTree className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {chalet.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            /{chalet._id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground max-w-xs truncate">
                        {chalet.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={chalet.pagesCount > 0 ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                      >
                        {chalet.pagesCount} page
                        {chalet.pagesCount !== 1 ? "s" : ""}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(chalet.createdAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(chalet.updatedAt)}
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
                            href={`/admin/chalets/${chalet._id}`}
                            startContent={<BsEye className="h-4 w-4" />}
                          >
                            Voir détails
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            as={Link}
                            href={`/admin/chalets/${chalet._id}/edit`}
                            startContent={<BsPencil className="h-4 w-4" />}
                          >
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            key="qr"
                            as={Link}
                            href={`/admin/chalets/${chalet._id}/qr-codes`}
                            startContent={<BsQrCode className="h-4 w-4" />}
                          >
                            QR Codes
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            color="danger"
                            startContent={<BsTrash className="h-4 w-4" />}
                            onClick={() => {
                              setSelectedChalet(chalet);
                              onOpen();
                            }}
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

      {/* Modal de confirmation de suppression */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg font-semibold text-foreground">
              Supprimer le chalet
            </h3>
          </ModalHeader>
          <ModalBody>
            <p className="text-foreground">
              Êtes-vous sûr de vouloir supprimer le chalet{" "}
              <strong>{selectedChalet?.name}</strong> ?
            </p>
            <p className="text-sm text-muted-foreground">
              Cette action supprimera également toutes les pages associées et ne
              peut pas être annulée.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Annuler
            </Button>
            <Button
              color="danger"
              onPress={() =>
                selectedChalet && handleDeleteChalet(selectedChalet)
              }
            >
              Supprimer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
