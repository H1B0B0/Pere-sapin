"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Image,
  Link,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
  Skeleton,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { color, motion } from "framer-motion";
import {
  BsArrowLeft,
  BsPhone,
  BsPeople,
  BsStars,
  BsGeoAlt,
  BsCalendar,
  BsHeart,
  BsCheck2,
  BsShare,
  BsImages,
  BsHouse,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import {
  FaCheck,
  FaWifi,
  FaParking,
  FaPaw,
  FaFire,
  FaSwimmingPool,
  FaUtensils,
} from "react-icons/fa";
import { GiMountains } from "react-icons/gi";
import { MdEmail, MdLocationOn } from "react-icons/md";

import { getChaletByIdClient } from "@/lib/services/client-chalets";
import { getAvailabilitiesByChaletIdClient } from "@/lib/services/client-availability";
import { getAllPagesClient } from "@/lib/services/client-pages";
import { Chalet, Availability, Page, AvailabilityStatus } from "@/types";
import { CHALET_COLORS } from "@/config/colors";
import { CHALET_ICONS } from "@/config/icons";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

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

const getFeatureIcon = (feature: string, colorHex?: string) => {
  const lower = feature.toLowerCase();
  const style = colorHex ? { color: colorHex } : undefined;
  if (lower.includes("wifi") || lower.includes("internet"))
    return <FaWifi style={style} />;
  if (lower.includes("parking")) return <FaParking style={style} />;
  if (lower.includes("animaux") || lower.includes("chien"))
    return <FaPaw style={style} />;
  if (lower.includes("cheminée") || lower.includes("feu"))
    return <FaFire style={style} />;
  if (lower.includes("piscine")) return <FaSwimmingPool style={style} />;
  if (lower.includes("cuisine")) return <FaUtensils style={style} />;
  return <BsCheck2 style={style} />;
};

export default function ChaletDetailPage() {
  const params = useParams();
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getColorHex = (name?: string) =>
    CHALET_COLORS.find((c) => c.name === name)?.value;

  const getIconComponent = (id?: string) => {
    const it = CHALET_ICONS.find((i) => i.id === id);
    return it ? it.icon : GiMountains;
  };

  const getContrastColor = (hex?: string) => {
    if (!hex) return undefined;
    try {
      const c = hex.replace("#", "");
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      // standard luminance formula
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.6 ? "#111827" : "#ffffff";
    } catch {
      return undefined;
    }
  };

  // compute current color/icon from chalet when available
  const colorHex = chalet ? getColorHex(chalet.color || undefined) : undefined;
  const colorStyle = colorHex ? { color: colorHex } : undefined;
  const bgLightStyle = colorHex
    ? { backgroundColor: `${colorHex}33` }
    : undefined;
  const IconComp = chalet
    ? getIconComponent(chalet.icon || undefined)
    : GiMountains;

  const contrastColor = colorHex ? getContrastColor(colorHex) : undefined;
  const btnCallStyle = colorHex
    ? {
        backgroundColor: colorHex,
        color: contrastColor,
        borderColor: `${colorHex}cc`,
      }
    : undefined;
  const cardBorderStyle = colorHex
    ? { border: `1px solid ${colorHex}20` }
    : undefined;
  const headerBgStyle = colorHex
    ? { backgroundColor: `${colorHex}14`, border: `1px solid ${colorHex}20` }
    : undefined;

  // Gestion de la navigation au clavier dans le modal
  useEffect(() => {
    if (!isOpen || !chalet) return;

    const images =
      chalet.images && chalet.images.length > 0
        ? chalet.images
        : chalet.mainImage
          ? [chalet.mainImage]
          : [];

    if (images.length <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setSelectedImageIndex((prev) =>
            prev > 0 ? prev - 1 : images.length - 1
          );
          break;
        case "ArrowRight":
          event.preventDefault();
          setSelectedImageIndex((prev) =>
            prev < images.length - 1 ? prev + 1 : 0
          );
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, chalet, onClose, setSelectedImageIndex]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const chaletId = params.chaletId as string;
        const [chaletData, availabilityData, pagesData] = await Promise.all([
          getChaletByIdClient(chaletId),
          getAvailabilitiesByChaletIdClient(chaletId),
          getAllPagesClient(),
        ]);

        setChalet(chaletData);
        setAvailabilities(availabilityData);
        const chaletPages = pagesData.filter((page) =>
          typeof page.chalet === "string"
            ? page.chalet === chaletId
            : page.chalet._id === chaletId
        );
        setPages(chaletPages);
      } catch (e) {
        console.error("Erreur chargement chalet", e);
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

  const nextAvailability = availabilities
    .filter(
      (a) =>
        a.status === AvailabilityStatus.AVAILABLE &&
        new Date(a.startDate) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )[0];

  const availableAvailabilities = availabilities.filter(
    (a) =>
      a.status === AvailabilityStatus.AVAILABLE &&
      new Date(a.startDate) >= new Date()
  );

  const getAvailabilityPrice = (availability: Availability) => {
    return availability.pricePerNight || chalet?.pricePerNight || 0;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <GiMountains className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Chalet introuvable</h2>
        <p className="text-muted-foreground mb-8">
          Le chalet demandé n'existe pas ou n'est plus disponible.
        </p>
        <Button
          as={Link}
          href="/chalets"
          color="primary"
          startContent={<BsArrowLeft />}
        >
          Retour aux chalets
        </Button>
      </div>
    );
  }

  const images =
    chalet.images && chalet.images.length > 0
      ? chalet.images
      : chalet.mainImage
        ? [chalet.mainImage]
        : [];

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: chalet.name,
        text: chalet.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <BreadcrumbItem href="/">Accueil</BreadcrumbItem>
        <BreadcrumbItem href="/chalets">Chalets</BreadcrumbItem>
        <BreadcrumbItem>{chalet.name}</BreadcrumbItem>
      </Breadcrumbs>

      {/* Hero Section */}
      <motion.div {...fadeInUp} className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="text-3xl" style={colorStyle}>
                <IconComp className="h-7 w-7 black" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{chalet.name}</h1>
              {chalet.isActive ? (
                <Chip
                  color="success"
                  variant="flat"
                  startContent={<FaCheck className="h-3 w-3" />}
                >
                  Disponible
                </Chip>
              ) : (
                <Chip color="danger" variant="flat">
                  Indisponible
                </Chip>
              )}
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              {chalet.location && (
                <div className="flex items-center gap-1">
                  <MdLocationOn className="h-4 w-4" style={colorStyle} />
                  <span>{chalet.location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="flat"
              onPress={handleFavoriteToggle}
              className={isFavorite ? "text-danger" : ""}
            >
              <BsHeart style={isFavorite ? { color: "#ef4444" } : colorStyle} />
            </Button>
            <Button isIconOnly variant="flat" onPress={handleShare}>
              <BsShare style={colorStyle} />
            </Button>
            {chalet.contactPhone && (
              <Button
                as={Link}
                href={`tel:${chalet.contactPhone}`}
                variant="solid"
                startContent={<BsPhone />}
                style={btnCallStyle}
              >
                Appeler
              </Button>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 ? (
          <div className="space-y-4">
            <button
              type="button"
              className="relative w-full h-96 cursor-pointer overflow-hidden rounded-2xl group focus:outline-none"
              onClick={onOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen();
                }
              }}
              tabIndex={0}
              aria-label={`Ouvrir la galerie d'images pour ${chalet.name}`}
            >
              <img
                src={images[selectedImageIndex]}
                alt={chalet.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <BsImages className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </button>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${chalet.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {images.length > 6 && (
                  <div className="flex-shrink-0 w-20 h-20 bg-content2 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
                    +{images.length - 6}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-96 w-full bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center rounded-2xl">
            <div className="text-center">
              <GiMountains className="text-6xl text-primary/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune image disponible</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card>
              <CardBody className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">À propos de ce chalet</h2>
                {chalet.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {chalet.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {chalet.capacity && (
                    <div className="text-center p-3 bg-content2 rounded-lg">
                      <BsPeople
                        className="h-6 w-6 mx-auto mb-2"
                        style={colorStyle}
                      />
                      <div className="font-semibold">{chalet.capacity}</div>
                      <div className="text-sm text-muted-foreground">
                        Voyageurs
                      </div>
                    </div>
                  )}
                  {chalet.bedrooms && (
                    <div className="text-center p-3 bg-content2 rounded-lg">
                      <BsHouse
                        className="h-6 w-6 mx-auto mb-2"
                        style={colorStyle}
                      />
                      <div className="font-semibold">{chalet.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">
                        Chambres
                      </div>
                    </div>
                  )}
                  {chalet.bathrooms && (
                    <div className="text-center p-3 bg-content2 rounded-lg">
                      <BsStars
                        className="h-6 w-6 mx-auto mb-2"
                        style={colorStyle}
                      />
                      <div className="font-semibold">{chalet.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">
                        Salles de bain
                      </div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-content2 rounded-lg">
                    <BsStars
                      className="h-6 w-6 mx-auto mb-2"
                      style={colorStyle}
                    />
                    <div className="font-semibold">3★</div>
                    <div className="text-sm text-muted-foreground">
                      Classement
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Équipements et services */}
          {(chalet.features || chalet.amenities || chalet.highlights) && (
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card>
                <CardHeader className="pb-3">
                  <h2 className="text-2xl font-bold">
                    Équipements et services
                  </h2>
                </CardHeader>
                <CardBody className="space-y-8">
                  {chalet.highlights && chalet.highlights.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <BsStars style={colorStyle} />
                        Points forts
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {chalet.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-center gap-3 p-3 rounded-lg"
                            style={
                              colorHex
                                ? {
                                    backgroundColor: `${colorHex}14`,
                                    border: `1px solid ${colorHex}20`,
                                  }
                                : {}
                            }
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ background: colorHex || undefined }}
                            />
                            <span className="font-medium" style={colorStyle}>
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {chalet.features && chalet.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <BsCheck2
                          style={colorHex ? { color: colorHex } : undefined}
                        />
                        Équipements & Installations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {chalet.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3 p-3 bg-content2/50 rounded-lg hover:bg-content2 transition-colors"
                          >
                            {getFeatureIcon(feature, colorHex)}
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {chalet.amenities && chalet.amenities.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <BsHouse className="text-secondary" />
                        Commodités incluses
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {chalet.amenities.map((amenity) => (
                          <Chip
                            key={amenity}
                            variant="flat"
                            size="md"
                            className="bg-secondary/10 text-secondary border border-secondary/20"
                          >
                            {amenity}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Disponibilités avec Calendrier */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BsCalendar style={colorStyle} className="text-primary" />
                  Disponibilités et réservation
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {availabilities.length === 0 ? (
                  <div
                    className="bg-success/10 border border-success/20 rounded-lg p-4"
                    style={
                      colorHex
                        ? {
                            backgroundColor: `${colorHex}14`,
                            border: `1px solid ${colorHex}20`,
                          }
                        : {}
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="flex items-center gap-2 text-success font-medium"
                        style={colorStyle}
                      >
                        <BsCalendar style={colorStyle} />
                        🎉 Chalet disponible toute l'année
                      </div>
                      <div className="text-right">
                        {chalet.pricePerNight && (
                          <>
                            <div className="text-xl font-bold text-success">
                              {chalet.pricePerNight}€
                            </div>
                            <div className="text-xs text-success/70">
                              par nuit
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Aucune période spécifique définie - Contactez le
                      propriétaire pour réserver aux dates de votre choix !
                    </p>
                    <div
                      className="flex items-center gap-4 text-xs text-success"
                      style={colorStyle}
                    >
                      <span>✓ Réservation possible toute l'année</span>
                      <span>✓ Choix libre des dates</span>
                      <span>✓ Contact direct</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* En-tête avec résumé */}
                    <div className="rounded-lg p-4" style={headerBgStyle}>
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center gap-2 font-medium"
                          style={colorStyle}
                        >
                          <BsCalendar style={colorStyle} />
                          Calendrier des disponibilités
                        </div>
                        {availableAvailabilities.length > 0 && (
                          <div className="text-right">
                            <div
                              className="text-sm font-semibold"
                              style={colorStyle}
                            >
                              {availableAvailabilities.length} période
                              {availableAvailabilities.length > 1
                                ? "s"
                                : ""}{" "}
                              disponible
                              {availableAvailabilities.length > 1 ? "s" : ""}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Calendrier */}
                    <Card className="border border-divider">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between w-full">
                          <h3 className="text-xl font-semibold capitalize">
                            {monthYear}
                          </h3>
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() => navigateMonth("prev")}
                            >
                              <BsChevronLeft style={colorStyle} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() => navigateMonth("next")}
                            >
                              <BsChevronRight style={colorStyle} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        {/* En-têtes des jours */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {[
                            "Dim",
                            "Lun",
                            "Mar",
                            "Mer",
                            "Jeu",
                            "Ven",
                            "Sam",
                          ].map((day) => (
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
                            const isPastDate =
                              date < new Date(new Date().setHours(0, 0, 0, 0));

                            return (
                              <div
                                key={index}
                                className={`
                                  relative min-h-[80px] p-2 border rounded-lg transition-colors
                                  ${isCurrentMonth ? "bg-background" : "bg-muted/30"}
                                  ${isToday ? "ring-2 ring-primary" : ""}
                                  ${availability ? "hover:bg-muted/50" : "hover:bg-muted/30"}
                                  ${isPastDate ? "opacity-50" : ""}
                                `}
                              >
                                <div
                                  className={`text-sm ${isCurrentMonth ? "text-foreground" : "text-muted-foreground"}`}
                                >
                                  {date.getDate()}
                                </div>

                                {availability && (
                                  <div className="mt-1">
                                    <Chip
                                      className="text-xs mb-1"
                                      color={statusColors[availability.status]}
                                      size="sm"
                                      variant="flat"
                                    >
                                      {statusLabels[availability.status]}
                                    </Chip>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Légende */}
                        <div className="flex flex-wrap gap-4 justify-center text-sm mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-success"></div>
                            <span>Disponible</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-danger"></div>
                            <span>Réservé</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-warning"></div>
                            <span>Bloqué</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-secondary"></div>
                            <span>Maintenance</span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Guides pratiques */}
          {pages.length > 0 && (
            <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader className="pb-3">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BsStars className="text-primary" style={colorStyle} />
                    Guides et informations utiles
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <p className="text-muted-foreground">
                    Découvrez nos guides pratiques pour profiter au maximum de
                    votre séjour
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pages.map((page) => (
                      <Link
                        key={page._id}
                        href={`/chalets/${chalet._id}/${page.slug}`}
                        className="block group"
                      >
                        <Card
                          className="h-full hover:shadow-lg transition-all duration-300 border"
                          style={
                            colorHex
                              ? {
                                  borderColor: `${colorHex}20`,
                                  transition: "border-color 200ms",
                                }
                              : undefined
                          }
                          onMouseEnter={(e) => {
                            if (colorHex)
                              e.currentTarget.style.borderColor = `${colorHex}40`;
                          }}
                          onMouseLeave={(e) => {
                            if (colorHex)
                              e.currentTarget.style.borderColor = `${colorHex}20`;
                          }}
                        >
                          {" "}
                          <CardBody className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <h3
                                className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1"
                                style={colorStyle}
                              >
                                {page.title}
                              </h3>
                              <BsArrowLeft
                                className="text-muted-foreground group-hover:text-primary transition-colors rotate-180 flex-shrink-0 ml-2"
                                onMouseEnter={(e) => {
                                  if (colorHex)
                                    e.currentTarget.style.borderColor = `${colorHex}40`;
                                }}
                                onMouseLeave={(e) => {
                                  if (colorHex)
                                    e.currentTarget.style.borderColor = `${colorHex}20`;
                                }}
                              />
                            </div>

                            {page.tags.length > 0 && (
                              <div
                                className="flex flex-wrap gap-1 pt-2"
                                color=""
                              >
                                {page.tags.slice(0, 3).map((tag) => (
                                  <Chip
                                    key={tag}
                                    size="sm"
                                    variant="flat"
                                    className="bg-primary/10 text-primary border border-primary/20"
                                    style={
                                      colorHex
                                        ? {
                                            backgroundColor: `${colorHex}14`,
                                            border: `1px solid ${colorHex}20`,
                                            ...colorStyle,
                                          }
                                        : colorStyle
                                    }
                                  >
                                    {tag}
                                  </Chip>
                                ))}
                                {page.tags.length > 3 && (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    className="bg-content2"
                                    style={colorStyle}
                                  >
                                    +{page.tags.length - 3}
                                  </Chip>
                                )}
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      💡 Ces guides sont mis à jour régulièrement pour vous
                      offrir les meilleures informations
                    </p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <Card className="sticky top-6 shadow-lg" style={cardBorderStyle}>
              <CardHeader className="pb-3" style={headerBgStyle}>
                <h3
                  className="text-xl font-bold text-center w-full"
                  style={colorStyle}
                >
                  Réservation
                </h3>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {chalet.pricePerNight && (
                  <div className="text-center p-4 bg-content2/30 rounded-xl">
                    <div className="text-3xl font-bold text-primary">
                      {chalet.pricePerNight}€
                      <span className="text-lg font-normal text-muted-foreground">
                        /nuit
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prix indicatif de base
                    </p>
                    {nextAvailability && (
                      <div className="mt-2 p-2 bg-success/10 rounded-lg border border-success/20">
                        <p className="text-xs text-success font-medium">
                          📅 Prochaine dispo:{" "}
                          {getAvailabilityPrice(nextAvailability)}€/nuit
                        </p>
                        <p className="text-xs text-success/70">
                          Du{" "}
                          {new Date(
                            nextAvailability.startDate
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                      <BsPhone className="text-primary" style={colorStyle} />
                      Contact direct propriétaire
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sans intermédiaire • Sans commission • Réponse garantie
                      sous 24h
                    </p>
                  </div>

                  <div className="space-y-3">
                    {chalet.contactEmail && (
                      <Button
                        as={Link}
                        href={`mailto:${chalet.contactEmail}?subject=Demande de réservation - ${chalet.name}&body=Bonjour,%0D%0A%0D%0AJe suis intéressé(e) par une réservation pour le chalet ${chalet.name}.%0D%0A%0D%0APériode souhaitée : %0D%0ANombre de personnes : %0D%0A%0D%0AMerci de me faire parvenir vos disponibilités et tarifs.%0D%0A%0D%0ACordialement`}
                        variant="solid"
                        fullWidth
                        size="lg"
                        startContent={<MdEmail style={colorStyle} />}
                        className="font-semibold"
                        style={
                          colorHex
                            ? { borderColor: `${colorHex}33` }
                            : undefined
                        }
                      >
                        Demander un devis
                      </Button>
                    )}
                    {chalet.contactPhone && (
                      <Button
                        as={Link}
                        href={`tel:${chalet.contactPhone}`}
                        fullWidth
                        size="lg"
                        startContent={<BsPhone />}
                        className="font-semibold"
                        style={btnCallStyle}
                      >
                        {chalet.contactPhone}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <div className="font-semibold text-success">0%</div>
                      <div className="text-muted-foreground">Commission</div>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <div className="font-semibold text-primary">24h</div>
                      <div className="text-muted-foreground">Réponse</div>
                    </div>
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <div className="font-semibold text-warning">3★</div>
                      <div className="text-muted-foreground">Qualité</div>
                    </div>
                  </div>
                </div>

                {chalet.prices && (
                  <>
                    <Divider />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <BsCalendar className="text-primary" />
                        Grille tarifaire
                      </h4>
                      <div className="space-y-2">
                        {chalet.prices.weekend && (
                          <div className="flex justify-between items-center p-2 bg-content2/30 rounded">
                            <span className="text-sm">Week-end</span>
                            <Chip color="primary" variant="bordered">
                              {chalet.prices.weekend}
                            </Chip>
                          </div>
                        )}
                        {chalet.prices.week && (
                          <div className="flex justify-between items-center p-2 bg-content2/30 rounded">
                            <span className="text-sm">Semaine</span>
                            <Chip color="success" variant="bordered">
                              {chalet.prices.week}
                            </Chip>
                          </div>
                        )}
                        {chalet.prices.holidays && (
                          <div className="flex justify-between items-center p-2 bg-content2/30 rounded">
                            <span className="text-sm">Vacances scolaires</span>
                            <Chip color="warning" variant="bordered">
                              {chalet.prices.holidays}
                            </Chip>
                          </div>
                        )}
                        {chalet.prices.cleaning && (
                          <div className="flex justify-between items-center p-2 bg-content2/30 rounded">
                            <span className="text-sm">Ménage (optionnel)</span>
                            <Chip color="secondary" variant="bordered">
                              {chalet.prices.cleaning}
                            </Chip>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        📅 Les tarifs peuvent varier selon la période et la
                        durée du séjour
                      </p>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        placement="center"
        className="m-4"
        closeButton={<></>}
        backdrop="blur"
        hideCloseButton
      >
        <ModalContent>
          <ModalBody className="p-0 relative overflow-hidden">
            <div className="relative bg-black flex items-center justify-center">
              {images[selectedImageIndex] && (
                <img
                  src={images[selectedImageIndex]}
                  alt={chalet.name}
                  className="w-full h-full object-contain select-none"
                  loading="eager"
                />
              )}

              {/* Bouton de fermeture avec z-index élevé */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors z-50 shadow-lg"
                aria-label="Fermer la galerie"
              >
                ✕
              </button>

              {/* Boutons de navigation avec z-index élevé */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev > 0 ? prev - 1 : images.length - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors z-50 shadow-lg text-xl"
                    aria-label="Image précédente"
                  >
                    <BsChevronLeft />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev < images.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 transition-colors z-50 shadow-lg text-xl"
                    aria-label="Image suivante"
                  >
                    <BsChevronRight />
                  </button>
                </>
              )}

              {/* Indicateur de position avec z-index élevé */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-medium shadow-lg">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                  {images.length > 1 && images.length <= 10 && (
                    <div className="flex gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === selectedImageIndex
                              ? "bg-white scale-125"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                          aria-label={`Aller à l'image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Support du clavier */}
              <div className="sr-only">
                Utilisez les flèches gauche/droite pour naviguer, Échap pour
                fermer
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
