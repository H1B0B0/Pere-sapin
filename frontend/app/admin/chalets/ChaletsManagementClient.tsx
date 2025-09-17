"use client";

import { useEffect, useState } from "react";
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
  Spinner,
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

import { useChaletsStore, ChaletWithPages } from "@/lib/chalets-store";
import { deleteChaletAction } from "@/lib/actions/chalets";

type ChaletsManagementClientProps = {
  initialChalets: ChaletWithPages[];
};

export default function ChaletsManagementClient({
  initialChalets,
}: ChaletsManagementClientProps) {
  const { chalets, loading, error, fetchChalets, removeChalet, clearError } =
    useChaletsStore();

  const [selectedChalet, setSelectedChalet] = useState<ChaletWithPages | null>(
    null
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Hydrate the store with server-fetched chalets on first render
  useEffect(() => {
    if (initialChalets && initialChalets.length > 0) {
      // Set chalets in store with a fresh timestamp
      useChaletsStore.setState({
        chalets: initialChalets,
        loading: false,
        error: null,
        lastFetch: Date.now(),
      });
    }
  }, [initialChalets]);

  // Fetch from API only if store is empty and not already loading
  useEffect(() => {
    if (chalets.length === 0) {
      void fetchChalets();
    }
  }, [chalets.length, fetchChalets]);

  const handleDeleteChalet = async (chalet: ChaletWithPages) => {
    try {
      await deleteChaletAction(chalet._id);
      removeChalet(chalet._id);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
        <span className="ml-2">Chargement des chalets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardBody className="text-center">
            <p className="text-danger">{error}</p>
            <Button
              color="primary"
              className="mt-4"
              onPress={() => {
                clearError();
                fetchChalets();
              }}
            >
              Réessayer
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

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
              <BsTree className="text-2xl text-success" />
              <h1 className="text-2xl font-bold">Gestion des Chalets</h1>
            </div>
            <Button
              as={Link}
              className="bg-success text-white"
              endContent={<BsPlus />}
              href="/admin/chalets/new"
            >
              Nouveau Chalet
            </Button>
          </CardHeader>
          <CardBody>
            <Table aria-label="Chalets table">
              <TableHeader>
                <TableColumn>NOM</TableColumn>
                <TableColumn>LIEU</TableColumn>
                <TableColumn>CAPACITÉ</TableColumn>
                <TableColumn>PRIX/NUIT</TableColumn>
                <TableColumn>PAGES</TableColumn>
                <TableColumn>STATUT</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="Aucun chalet trouvé">
                {chalets.map((chalet) => (
                  <TableRow key={chalet._id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{chalet.name}</p>
                        {chalet.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {chalet.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {chalet.location && (
                          <p className="text-sm font-medium">
                            {chalet.location}
                          </p>
                        )}
                        {chalet.address && (
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {chalet.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {chalet.capacity ? (
                        <Chip color="primary" size="sm" variant="flat">
                          {chalet.capacity} pers.
                        </Chip>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {chalet.pricePerNight ? (
                        <div className="text-sm">
                          <span className="font-semibold">
                            {chalet.pricePerNight}€
                          </span>
                          <span className="text-gray-500">/nuit</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={chalet.pagesCount > 0 ? "success" : "default"}
                        size="sm"
                        variant="flat"
                      >
                        {chalet.pagesCount} page(s)
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={chalet.isActive ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                      >
                        {chalet.isActive ? "Actif" : "Inactif"}
                      </Chip>
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
                            href={`/admin/chalets/${chalet._id}`}
                            startContent={<BsEye />}
                          >
                            Voir détails
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            as={Link}
                            href={`/admin/chalets/${chalet._id}/edit`}
                            startContent={<BsPencil />}
                          >
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            key="qrcodes"
                            as={Link}
                            href={`/admin/qr-codes?chalet=${chalet._id}`}
                            startContent={<BsQrCode />}
                          >
                            QR Codes
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<BsTrash />}
                            onPress={() => {
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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmer la suppression
              </ModalHeader>
              <ModalBody>
                <p>
                  Êtes-vous sûr de vouloir supprimer le chalet "
                  {selectedChalet?.name}" ? Cette action est irréversible.
                </p>
                {selectedChalet && selectedChalet.pagesCount > 0 && (
                  <p className="text-warning text-sm">
                    Attention : Ce chalet contient {selectedChalet.pagesCount}{" "}
                    page(s) qui seront également supprimées.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
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
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
