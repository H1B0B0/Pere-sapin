"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsArrowLeft,
  BsCalendar,
  BsPlus,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import Link from "next/link";

import { getChaletById } from "@/lib/services/chalets";
import { getAvailabilitiesByChaletIdClient } from "@/lib/services/client-availability";
import {
  createAvailabilityAction,
  deleteAvailabilityAction,
} from "@/lib/actions/availability";
import {
  Chalet,
  Availability,
  AvailabilityStatus,
  CreateAvailabilityDto,
} from "@/types";

const statusColors = {
  [AvailabilityStatus.AVAILABLE]: "success",
  [AvailabilityStatus.BOOKED]: "danger",
  [AvailabilityStatus.BLOCKED]: "warning",
  [AvailabilityStatus.MAINTENANCE]: "secondary",
} as const;

const statusLabels = {
  [AvailabilityStatus.AVAILABLE]: "Disponible",
  [AvailabilityStatus.BOOKED]: "Réservé",
  [AvailabilityStatus.BLOCKED]: "Bloqué",
  [AvailabilityStatus.MAINTENANCE]: "Maintenance",
};

export default function ChaletCalendarPage() {
  const params = useParams();
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAvailability, setSelectedAvailability] =
    useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState<CreateAvailabilityDto>({
    chalet: "",
    startDate: "",
    endDate: "",
    status: AvailabilityStatus.AVAILABLE,
    pricePerNight: undefined,
    notes: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const chaletId = params.chaletId as string;

        setFormData((prev) => ({ ...prev, chalet: chaletId }));

        const [chaletData, availabilityData] = await Promise.all([
          getChaletById(chaletId),
          getAvailabilitiesByChaletIdClient(chaletId),
        ]);

        setChalet(chaletData);
        setAvailabilities(availabilityData);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.chaletId]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Jours du mois précédent pour compléter la première semaine
    for (let i = startingDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);

      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Jours du mois courant
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Jours du mois suivant pour compléter la dernière semaine
    const remainingDays = 42 - days.length; // 6 semaines × 7 jours

    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  };

  const getAvailabilityForDate = (date: Date) => {
    return availabilities.find((availability) => {
      const start = new Date(availability.startDate);
      const end = new Date(availability.endDate);

      return date >= start && date <= end;
    });
  };

  const handleCreateAvailability = async () => {
    try {
      await createAvailabilityAction(formData);
      // Recharger les données
      const availabilityData = await getAvailabilitiesByChaletIdClient(
        params.chaletId as string,
      );

      setAvailabilities(availabilityData);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    try {
      await deleteAvailabilityAction(id, params.chaletId as string);
      setAvailabilities((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      chalet: params.chaletId as string,
      startDate: "",
      endDate: "",
      status: AvailabilityStatus.AVAILABLE,
      pricePerNight: chalet?.pricePerNight,
      notes: "",
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);

      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }

      return newDate;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du calendrier...</p>
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
        <Link href="/admin/chalets">
          <Button color="primary">Retour aux chalets</Button>
        </Link>
      </div>
    );
  }

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/chalets/${chalet._id}`}>
            <Button
              startContent={<BsArrowLeft className="h-4 w-4" />}
              variant="light"
            >
              Retour au chalet
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-primary/20">
              <BsCalendar className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
                Calendrier - {chalet.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez les disponibilités et réservations
              </p>
            </div>
          </div>
          <Button
            color="primary"
            startContent={<BsPlus className="h-4 w-4" />}
            onPress={() => {
              resetForm();
              onOpen();
            }}
          >
            Nouvelle période
          </Button>
        </div>
      </motion.div>

      {/* Calendrier */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-xl font-semibold text-foreground capitalize">
                {monthYear}
              </h2>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => navigateMonth("prev")}
                >
                  <BsChevronLeft />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => navigateMonth("next")}
                >
                  <BsChevronRight />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody>
            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(({ date, isCurrentMonth }, index) => {
                const availability = getAvailabilityForDate(date);
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    className={`
                      relative min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                      ${isCurrentMonth ? "bg-background" : "bg-muted/30"}
                      ${isToday ? "ring-2 ring-primary" : ""}
                      ${availability ? "hover:bg-muted/50" : "hover:bg-muted/30"}
                    `}
                    onClick={() => {
                      if (availability) {
                        setSelectedAvailability(availability);
                      }
                    }}
                  >
                    <div
                      className={`text-sm ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {date.getDate()}
                    </div>

                    {availability && (
                      <div className="mt-1">
                        <Chip
                          className="text-xs"
                          color={statusColors[availability.status]}
                          size="sm"
                          variant="flat"
                        >
                          {statusLabels[availability.status]}
                        </Chip>
                        {availability.pricePerNight && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {availability.pricePerNight}€/nuit
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Modal de création/modification */}
      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selectedAvailability
                  ? "Modifier la période"
                  : "Nouvelle période"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Date de début"
                    type="date"
                    value={formData.startDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Date de fin"
                    type="date"
                    value={formData.endDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Statut"
                    selectedKeys={[
                      formData.status || AvailabilityStatus.AVAILABLE,
                    ]}
                    onSelectionChange={(keys: any) => {
                      const status = Array.from(keys)[0] as AvailabilityStatus;

                      setFormData((prev) => ({ ...prev, status }));
                    }}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Prix par nuit (€)"
                    type="number"
                    value={formData.pricePerNight?.toString() || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricePerNight: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                  />
                </div>

                <Textarea
                  label="Notes"
                  placeholder="Notes supplémentaires..."
                  value={formData.notes || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                {selectedAvailability && (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      handleDeleteAvailability(selectedAvailability._id);
                      setSelectedAvailability(null);
                      onClose();
                    }}
                  >
                    Supprimer
                  </Button>
                )}
                <Button color="primary" onPress={handleCreateAvailability}>
                  {selectedAvailability ? "Modifier" : "Créer"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
