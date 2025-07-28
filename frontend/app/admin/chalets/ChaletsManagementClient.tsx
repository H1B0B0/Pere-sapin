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
import { Chalet } from "@/types";
import { deleteChaletAction } from "@/lib/actions/chalets";

interface ChaletWithPages extends Chalet {
  pagesCount: number;
}

interface Props {
  initialChalets: ChaletWithPages[];
}

export default function ChaletsManagementClient({ initialChalets }: Props) {
  const [chalets, setChalets] = useState<ChaletWithPages[]>(initialChalets);
  const [selectedChalet, setSelectedChalet] = useState<ChaletWithPages | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteChalet = async (chalet: ChaletWithPages) => {
    try {
      await deleteChaletAction(chalet._id);
      setChalets((prev) => prev.filter((c) => c._id !== chalet._id));
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
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
                <TableColumn>PAGES</TableColumn>
                <TableColumn>CRÉÉ LE</TableColumn>
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
                          <p className="text-sm text-gray-500">
                            {chalet.description}
                          </p>
                        )}
                      </div>
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
                      {new Date(chalet.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={chalet.pagesCount > 0 ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                      >
                        {chalet.pagesCount > 0 ? "Actif" : "Inactif"}
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
                            startContent={<BsEye />}
                            as={Link}
                            href={`/admin/chalets/${chalet._id}`}
                          >
                            Voir détails
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            startContent={<BsPencil />}
                            as={Link}
                            href={`/admin/chalets/${chalet._id}/edit`}
                          >
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            key="qrcodes"
                            startContent={<BsQrCode />}
                            as={Link}
                            href={`/admin/qr-codes?chalet=${chalet._id}`}
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
                  onPress={() => selectedChalet && handleDeleteChalet(selectedChalet)}
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