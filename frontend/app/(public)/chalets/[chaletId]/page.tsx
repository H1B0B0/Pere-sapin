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
  Badge,
} from "@heroui/react";
import { Calendar } from "@heroui/calendar";
import { motion } from "framer-motion";
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

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const getFeatureIcon = (feature: string) => {
  const lower = feature.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet"))
    return <FaWifi className="text-primary" />;
  if (lower.includes("parking")) return <FaParking className="text-primary" />;
  if (lower.includes("animaux") || lower.includes("chien"))
    return <FaPaw className="text-primary" />;
  if (lower.includes("cheminée") || lower.includes("feu"))
    return <FaFire className="text-primary" />;
  if (lower.includes("piscine"))
    return <FaSwimmingPool className="text-primary" />;
  if (lower.includes("cuisine")) return <FaUtensils className="text-primary" />;
  return <BsCheck2 className="text-success" />;
};

export default function ChaletDetailPage() {
  const params = useParams();
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const nextAvailability = availabilities
    .filter((a) => a.status === AvailabilityStatus.AVAILABLE)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )[0];

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // TODO: Persist to localStorage or API
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: chalet.name,
        text: chalet.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <GiMountains className="text-3xl text-primary" />
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
                  <MdLocationOn className="h-4 w-4" />
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
              <BsHeart className={isFavorite ? "fill-current" : ""} />
            </Button>
            <Button isIconOnly variant="flat" onPress={handleShare}>
              <BsShare />
            </Button>
            {chalet.contactPhone && (
              <Button
                as={Link}
                href={`tel:${chalet.contactPhone}`}
                color="success"
                startContent={<BsPhone />}
              >
                Appeler
              </Button>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 ? (
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative h-96 w-full cursor-pointer group rounded-2xl overflow-hidden"
              onClick={onOpen}
            >
              <Image
                src={images[selectedImageIndex]}
                alt={chalet.name}
                className="w-full h-full object-cover"
                radius="none"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <BsImages className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
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
                    <Image
                      src={image}
                      alt={`${chalet.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      radius="none"
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
                      <BsPeople className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{chalet.capacity}</div>
                      <div className="text-sm text-muted-foreground">
                        Voyageurs
                      </div>
                    </div>
                  )}
                  {chalet.bedrooms && (
                    <div className="text-center p-3 bg-content2 rounded-lg">
                      <BsHouse className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{chalet.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">
                        Chambres
                      </div>
                    </div>
                  )}
                  {chalet.bathrooms && (
                    <div className="text-center p-3 bg-content2 rounded-lg">
                      <BsStars className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="font-semibold">{chalet.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">
                        Salles de bain
                      </div>
                    </div>
                  )}
                  <div className="text-center p-3 bg-content2 rounded-lg">
                    <BsStars className="h-6 w-6 mx-auto mb-2 text-primary" />
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
                  {/* Points forts / Highlights */}
                  {chalet.highlights && chalet.highlights.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <BsStars className="text-primary" />
                        Points forts
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {chalet.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                          >
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                            <span className="font-medium text-primary">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Caractéristiques principales */}
                  {chalet.features && chalet.features.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <BsCheck2 className="text-success" />
                        Équipements & Installations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {chalet.features.map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3 p-3 bg-content2/50 rounded-lg hover:bg-content2 transition-colors"
                          >
                            {getFeatureIcon(feature)}
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Commodités supplémentaires */}
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

                  {/* Informations pratiques */}
                  <div>
                    <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                      <BsStars className="text-warning" />
                      Informations pratiques
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        {chalet.bedrooms && (
                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg">
                            <span className="text-sm font-medium">
                              Configuration des chambres
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {chalet.bedrooms}
                            </span>
                          </div>
                        )}
                        {chalet.bathrooms && (
                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg">
                            <span className="text-sm font-medium">
                              Salles de bain
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {chalet.bathrooms}
                            </span>
                          </div>
                        )}
                        {chalet.rooms && (
                          <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg">
                            <span className="text-sm font-medium">Pièces</span>
                            <span className="text-sm text-muted-foreground">
                              {chalet.rooms}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg">
                          <span className="text-sm font-medium">
                            Classement
                          </span>
                          <span className="text-sm text-muted-foreground">
                            3 étoiles
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg">
                          <span className="text-sm font-medium">Contact</span>
                          <span className="text-sm text-muted-foreground">
                            Direct propriétaire
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-content2/30 rounded-lg">
                          <span className="text-sm font-medium">
                            Commission
                          </span>
                          <span className="text-sm text-success font-medium">
                            0% - Sans frais
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Disponibilités avec Calendrier */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <BsCalendar className="text-primary" />
                  Disponibilités et réservation
                </h2>
              </CardHeader>
              <CardBody className="space-y-6">
                {nextAvailability && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-success font-medium mb-2">
                      <BsCalendar />
                      Prochaine disponibilité
                    </div>
                    <p className="text-sm">
                      Du{" "}
                      {new Date(nextAvailability.startDate).toLocaleDateString(
                        "fr-FR"
                      )}
                      au{" "}
                      {new Date(nextAvailability.endDate).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                    {nextAvailability.pricePerNight && (
                      <p className="text-sm font-semibold text-success mt-1">
                        {nextAvailability.pricePerNight}€/nuit
                      </p>
                    )}
                  </div>
                )}

                {availabilities.length > 0 ? (
                  <div className="space-y-4">
                    {/* Calendrier */}
                    <div className="flex justify-center">
                      <Calendar
                        aria-label="Calendrier des disponibilités"
                        color="primary"
                        showMonthAndYearPickers
                        className="max-w-md"
                      />
                    </div>

                    {/* Légende */}
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
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

                    {/* Liste des périodes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {availabilities.slice(0, 6).map((availability) => (
                        <div
                          key={availability._id}
                          className="border border-divider rounded-lg p-3 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Chip
                              size="sm"
                              color={
                                availability.status ===
                                AvailabilityStatus.AVAILABLE
                                  ? "success"
                                  : availability.status ===
                                      AvailabilityStatus.BOOKED
                                    ? "danger"
                                    : availability.status ===
                                        AvailabilityStatus.BLOCKED
                                      ? "warning"
                                      : "secondary"
                              }
                              variant="flat"
                            >
                              {availability.status}
                            </Chip>
                            {availability.pricePerNight && (
                              <span className="font-semibold text-primary">
                                {availability.pricePerNight}€/nuit
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              availability.startDate
                            ).toLocaleDateString("fr-FR")}{" "}
                            -
                            {new Date(availability.endDate).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.ceil(
                              (new Date(availability.endDate).getTime() -
                                new Date(availability.startDate).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{" "}
                            nuits
                          </p>
                        </div>
                      ))}
                    </div>

                    {availabilities.length > 6 && (
                      <div className="text-center">
                        <Button variant="flat" size="sm">
                          Voir toutes les disponibilités (
                          {availabilities.length})
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BsCalendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Aucune disponibilité définie pour le moment
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contactez le propriétaire pour plus d'informations
                    </p>
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
                    <BsStars className="text-primary" />
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
                        <Card className="h-full hover:shadow-lg transition-all duration-300 border border-divider group-hover:border-primary/50">
                          <CardBody className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                {page.title}
                              </h3>
                              <BsArrowLeft className="text-muted-foreground group-hover:text-primary transition-colors rotate-180 flex-shrink-0 ml-2" />
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {page.content
                                ?.replace(/[#_*`>/\\-]/g, " ")
                                .slice(0, 120)}
                              {page.content && page.content.length > 120
                                ? "..."
                                : ""}
                            </p>

                            {page.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-2">
                                {page.tags.slice(0, 3).map((tag) => (
                                  <Chip
                                    key={tag}
                                    size="sm"
                                    variant="flat"
                                    className="bg-primary/10 text-primary border border-primary/20"
                                  >
                                    {tag}
                                  </Chip>
                                ))}
                                {page.tags.length > 3 && (
                                  <Chip
                                    size="sm"
                                    variant="flat"
                                    className="bg-content2"
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
            <Card className="sticky top-6 border border-primary/20 shadow-lg">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-success/5">
                <h3 className="text-xl font-bold text-center w-full">
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
                    {nextAvailability && nextAvailability.pricePerNight && (
                      <p className="text-xs text-success font-medium mt-1">
                        Prochaine dispo: {nextAvailability.pricePerNight}€/nuit
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
                      <BsPhone className="text-primary" />
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
                        color="primary"
                        variant="solid"
                        fullWidth
                        size="lg"
                        startContent={<MdEmail />}
                        className="font-semibold"
                      >
                        Demander un devis
                      </Button>
                    )}
                    {chalet.contactPhone && (
                      <Button
                        as={Link}
                        href={`tel:${chalet.contactPhone}`}
                        color="success"
                        variant="flat"
                        fullWidth
                        size="lg"
                        startContent={<BsPhone />}
                        className="font-semibold"
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
                            <Badge color="primary" variant="flat">
                              {chalet.prices.weekend}
                            </Badge>
                          </div>
                        )}
                        {chalet.prices.week && (
                          <div className="flex justify-between items-center p-2 bg-content2/30 rounded">
                            <span className="text-sm">Semaine</span>
                            <Badge color="success" variant="flat">
                              {chalet.prices.week}
                            </Badge>
                          </div>
                        )}
                        {chalet.prices.holidays && (
                          <div className="flex justify-between items-center p-2 bg-content2/30 rounded">
                            <span className="text-sm">Vacances scolaires</span>
                            <Badge color="warning" variant="flat">
                              {chalet.prices.holidays}
                            </Badge>
                          </div>
                        )}
                        {chalet.prices.cleaning && (
                          <div className="flex justify-between items-center p-2 bg-content2/30 rounded">
                            <span className="text-sm">Ménage (optionnel)</span>
                            <Badge color="secondary" variant="flat">
                              {chalet.prices.cleaning}
                            </Badge>
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

          {/* Location Card */}
          {chalet.address && (
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card>
                <CardBody className="p-6 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <BsGeoAlt className="text-primary" />
                    Localisation
                  </h3>
                  <p className="text-sm">{chalet.address}</p>
                  <div className="aspect-video bg-content2 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Carte à venir</span>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
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
      >
        <ModalContent>
          <ModalBody className="p-0">
            <div className="relative bg-black">
              {images[selectedImageIndex] && (
                <Image
                  src={images[selectedImageIndex]}
                  alt={chalet.name}
                  className="w-full max-h-[80vh] object-contain"
                  radius="none"
                />
              )}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ✕
              </button>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev > 0 ? prev - 1 : images.length - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev < images.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image counter and dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                  {images.length > 1 && images.length <= 10 && (
                    <div className="flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === selectedImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
