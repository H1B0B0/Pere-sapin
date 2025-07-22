"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Image,
  Divider,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BsArrowLeft,
  BsGeoAlt,
  BsPhone,
  BsCalendarCheck,
  BsStars,
  BsImages,
  BsInfoCircle,
  BsCheckCircle,
  BsX,
  BsChevronLeft,
  BsChevronRight,
  BsShield,
  BsCameraFill,
  BsCash,
  BsGear,
  BsPlay,
  BsPause,
} from "react-icons/bs";
import { IoBed } from "react-icons/io5";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import { GiPineTree, GiMountains, GiOakLeaf, GiSparkles } from "react-icons/gi";

interface ChaletDetailClientProps {
  chalet: {
    id: string;
    name: string;
    slug: string;
    capacity: string;
    rooms: string;
    images: string[];
    features: string[];
    highlights: string[];
    prices: {
      weekend: string;
      week: string;
      holidays: string;
      cleaning: string;
    };
    color: string;
    icon: string;
    bedrooms: string;
    bathrooms: string;
    description: string;
  };
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const icons = {
    "pine-tree": GiPineTree,
    mountains: GiMountains,
    leaf: GiOakLeaf,
    sparkles: GiSparkles,
  };
  return icons[iconName as keyof typeof icons] || GiPineTree;
};

export default function ChaletDetailClient({
  chalet,
}: ChaletDetailClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const IconComponent = getIconComponent(chalet.icon);

  // Auto-play functionality
  const nextImage = useCallback(() => {
    if (chalet.images.length > 1) {
      setSlideDirection("right");
      setPreviousImageIndex(currentImageIndex);
      setCurrentImageIndex((prev) => (prev + 1) % chalet.images.length);
    }
  }, [chalet.images.length, currentImageIndex]);

  const prevImage = useCallback(() => {
    if (chalet.images.length > 1) {
      setSlideDirection("left");
      setPreviousImageIndex(currentImageIndex);
      setCurrentImageIndex(
        (prev) => (prev - 1 + chalet.images.length) % chalet.images.length
      );
    }
  }, [chalet.images.length, currentImageIndex]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || isPaused || chalet.images.length <= 1) return;

    const interval = setInterval(nextImage, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, nextImage, chalet.images.length]);

  // Touch handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSlideDirection("right");
      nextImage();
    } else if (isRightSwipe) {
      setSlideDirection("left");
      prevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section avec image principale */}
        <div
          className="relative h-[60vh] md:h-[70vh] overflow-hidden rounded-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Image précédente (sortante) */}
            <motion.img
              key={`prev-${previousImageIndex}`}
              src={chalet.images[previousImageIndex]}
              alt={`Chalet ${chalet.name} - Previous`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
              initial={{ x: 0 }}
              animate={{
                x: slideDirection === "right" ? "-100%" : "100%",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            {/* Image actuelle (entrante) */}
            <motion.img
              key={`current-${currentImageIndex}`}
              src={chalet.images[currentImageIndex]}
              alt={`Chalet ${chalet.name}`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
              initial={{
                x: slideDirection === "right" ? "100%" : "-100%",
              }}
              animate={{ x: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          {/* Overlay avec navigation */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 z-10">
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-30">
              <Button
                as={Link}
                href="/chalets"
                variant="flat"
                size="sm"
                className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/20"
                startContent={<BsArrowLeft />}
              >
                <span className="hidden sm:inline">Retour aux chalets</span>
                <span className="sm:hidden">Retour</span>
              </Button>
            </div>

            {/* Contrôles images */}
            {chalet.images.length > 1 && (
              <>
                <Button
                  isIconOnly
                  size="md"
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-md text-white hover:bg-black/50 border border-white/30 z-30 rounded-full transition-all duration-300 hover:scale-110"
                  onPress={prevImage}
                >
                  <BsChevronLeft size={16} />
                </Button>
                <Button
                  isIconOnly
                  size="md"
                  className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 backdrop-blur-md text-white hover:bg-black/50 border border-white/30 z-30 rounded-full transition-all duration-300 hover:scale-110"
                  onPress={nextImage}
                >
                  <BsChevronRight size={16} />
                </Button>

                {/* Play/Pause button */}
                <Button
                  isIconOnly
                  size="sm"
                  className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/30 backdrop-blur-md text-white hover:bg-black/50 border border-white/30 z-30 rounded-full transition-all duration-300"
                  onPress={() => setIsAutoPlaying(!isAutoPlaying)}
                >
                  {isAutoPlaying ? <BsPause size={14} /> : <BsPlay size={14} />}
                </Button>

                {/* Progress bar for auto-play */}
                {isAutoPlaying && !isPaused && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
                    <motion.div
                      key={currentImageIndex}
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                    />
                  </div>
                )}

                <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                  {chalet.images.map((_, index) => (
                    <motion.button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-white scale-110"
                          : "bg-white/60 hover:bg-white/80"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  ))}
                </div>

                {/* Image counter */}
                <div className="absolute bottom-3 md:bottom-3 right-4 md:right-4 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm z-30">
                  {currentImageIndex + 1} / {chalet.images.length}
                </div>
              </>
            )}
          </div>

          {/* Titre et infos principales */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                    <IconComponent className="text-3xl md:text-4xl text-primary" />
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display leading-tight">
                      Chalet {chalet.name}
                    </h1>
                    <Badge content="3★" color="warning" placement="top-right">
                      <Chip color="primary" variant="solid" size="md">
                        {chalet.capacity}
                      </Chip>
                    </Badge>
                  </div>
                  <p className="text-base md:text-lg lg:text-xl text-white/90">
                    {chalet.rooms}
                  </p>
                </div>

                <div className="text-left md:text-right flex-shrink-0">
                  <div className="text-white/80 text-xs md:text-sm mb-1">
                    À partir de
                  </div>
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                    {chalet.prices.weekend.split("-")[0]}
                  </div>
                  <div className="text-white/80 text-xs md:text-sm">
                    par week-end
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Colonne principale - informations détaillées */}
            <div className="lg:col-span-2 space-y-8">
              {/* Points forts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="alpine-card">
                  <CardHeader>
                    <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                      <BsStars className="text-warning" />
                      Points Forts
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <div className="flex flex-wrap gap-2">
                      {chalet.highlights.map((highlight, index) => (
                        <Chip
                          key={index}
                          color="warning"
                          variant="flat"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          {highlight}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Configuration des chambres */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="alpine-card">
                  <CardHeader>
                    <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                      <IoBed className="text-primary" />
                      Configuration
                    </h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">
                        Chambres
                      </h3>
                      <p className="text-default-600">{chalet.bedrooms}</p>
                    </div>
                    <Divider />
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">
                        Salles de bain
                      </h3>
                      <p className="text-default-600">{chalet.bathrooms}</p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Équipements complets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="alpine-card">
                  <CardHeader className="flex justify-between">
                    <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                      <BsGear className="text-success" />
                      Équipements
                    </h2>
                    <Badge
                      content={chalet.features.length}
                      color="success"
                      shape="circle"
                    >
                      <Button size="sm" variant="flat" onPress={onOpen}>
                        Voir tout
                      </Button>
                    </Badge>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {chalet.features.slice(0, 12).map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-default-50 dark:bg-default-100 rounded-lg"
                        >
                          <BsCheckCircle className="text-success text-sm flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {chalet.features.length > 12 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center mt-4">
                          <Button
                            onPress={onOpen}
                            variant="flat"
                            color="primary"
                          >
                            +{chalet.features.length - 12} équipements
                            supplémentaires
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Galerie de photos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="alpine-card">
                  <CardHeader className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                      <BsCameraFill className="text-primary" />
                      Galerie Photos
                    </h2>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => {
                        setLightboxImageIndex(currentImageIndex);
                        setLightboxOpen(true);
                      }}
                      startContent={<BsImages />}
                    >
                      Vue plein écran
                    </Button>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {chalet.images.map((image, index) => (
                        <div
                          key={index}
                          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all hover:shadow-lg ${
                            index === currentImageIndex
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setLightboxImageIndex(index);
                            setLightboxOpen(true);
                          }}
                        >
                          <img
                            src={image}
                            alt={`${chalet.name} - Photo ${index + 1}`}
                            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                            <BsImages
                              className="text-white/0 hover:text-white/80 transition-colors duration-300"
                              size={20}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Informations pratiques */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="alpine-card">
                  <CardHeader>
                    <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                      <BsInfoCircle className="text-primary" />
                      Informations Pratiques
                    </h2>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-default-50 dark:bg-default-100 rounded-lg">
                        <BsGeoAlt
                          className="text-primary flex-shrink-0"
                          size={16}
                        />
                        <span className="font-medium">Les Vosges, France</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-success-50 dark:bg-success-100 rounded-lg">
                        <BsCheckCircle
                          className="text-success flex-shrink-0"
                          size={16}
                        />
                        <span className="text-success-700 dark:text-success-600">
                          Linge fourni complet
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-success-50 dark:bg-success-100 rounded-lg">
                        <BsCheckCircle
                          className="text-success flex-shrink-0"
                          size={16}
                        />
                        <span className="text-success-700 dark:text-success-600">
                          Parking privé gratuit
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-warning-50 dark:bg-warning-100 rounded-lg">
                        <BsShield
                          className="text-warning flex-shrink-0"
                          size={16}
                        />
                        <span className="text-warning-700 dark:text-warning-600">
                          Non-fumeur (extérieur OK)
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-danger-50 dark:bg-danger-100 rounded-lg">
                        <BsX className="text-danger flex-shrink-0" size={16} />
                        <span className="text-danger-700 dark:text-danger-600">
                          Animaux non admis
                        </span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-primary-50 dark:bg-primary-100 rounded-lg">
                        <BsInfoCircle
                          className="text-primary flex-shrink-0"
                          size={16}
                        />
                        <span className="text-primary-700 dark:text-primary-600">
                          Arrivée: 16h / Départ: 11h
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar - Réservation et contact */}
            <div className="space-y-6">
              {/* Card de réservation */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:sticky md:top-20 z-40"
              >
                <Card className="alpine-card shadow-lg">
                  <CardHeader>
                    <h3 className="text-xl font-bold font-display flex items-center gap-2">
                      <BsCash className="text-success" />
                      Tarifs & Réservation
                    </h3>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-default-50 dark:bg-default-100 rounded-lg">
                        <span className="font-medium">Week-end</span>
                        <span className="font-bold text-lg">
                          {chalet.prices.weekend}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-default-50 dark:bg-default-100 rounded-lg">
                        <span className="font-medium">Semaine</span>
                        <span className="font-bold text-lg">
                          {chalet.prices.week}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-warning-50 dark:bg-warning-100 rounded-lg">
                        <span className="font-medium">Fêtes</span>
                        <span className="font-bold text-lg text-warning">
                          {chalet.prices.holidays}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-default-50 dark:bg-default-100 rounded-lg">
                        <span className="font-medium">Ménage</span>
                        <span className="font-bold text-lg">
                          {chalet.prices.cleaning}
                        </span>
                      </div>
                    </div>

                    <Divider />

                    <div className="space-y-3">
                      <Button
                        as={Link}
                        href="tel:+33611233767"
                        color="success"
                        size="lg"
                        className="w-full btn-success text-white"
                        startContent={<BsPhone />}
                      >
                        Appeler M. STEPHAN
                      </Button>

                      <Button
                        as={Link}
                        href="/contact"
                        color="primary"
                        variant="flat"
                        size="lg"
                        className="w-full backdrop-blur-sm"
                        startContent={<BsCalendarCheck />}
                      >
                        Demander un devis
                      </Button>
                    </div>

                    <div className="text-xs text-default-500 text-center space-y-1">
                      <p className="flex items-center justify-center gap-1">
                        <FaExclamationTriangle className="text-warning" />
                        Évitez les commissions LeBonCoin
                      </p>
                      <p className="flex items-center justify-center gap-1">
                        <MdChat className="text-primary" />
                        Réponse garantie sous 24h
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Informations pratiques */}
              <Card className="alpine-card">
                <CardHeader>
                  <h3 className="text-lg font-bold font-display flex items-center gap-2">
                    <BsInfoCircle className="text-primary" />
                    Informations Pratiques
                  </h3>
                </CardHeader>
                <CardBody className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <BsGeoAlt className="text-primary" />
                    <span>Les Vosges, France</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsCheckCircle
                      className="text-success flex-shrink-0"
                      size={12}
                    />
                    <span>Linge fourni (draps, serviettes, peignoirs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsCheckCircle
                      className="text-success flex-shrink-0"
                      size={12}
                    />
                    <span>Parking privé gratuit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsShield
                      className="text-warning flex-shrink-0"
                      size={12}
                    />
                    <span>Non-fumeur (extérieur autorisé)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsX className="text-danger flex-shrink-0" size={12} />
                    <span>Animaux non admis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BsInfoCircle
                      className="text-primary flex-shrink-0"
                      size={12}
                    />
                    <span>Arrivée: 16h / Départ: 11h</span>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        {/* Modal équipements complets */}
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>
                  <h2 className="font-display">
                    Équipements complets - Chalet {chalet.name}
                  </h2>
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chalet.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-default-50"
                      >
                        <BsCheckCircle
                          className="text-success flex-shrink-0"
                          size={14}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    Fermer
                  </Button>
                  <Button color="success" as={Link} href="tel:+33611233767">
                    Réserver ce chalet
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Modal Lightbox pour les photos */}
        <Modal
          isOpen={lightboxOpen}
          onOpenChange={setLightboxOpen}
          size="5xl"
          hideCloseButton
          classNames={{
            base: "bg-transparent shadow-none md:m-auto md:max-w-5xl md:max-h-5xl m-0 max-w-full max-h-full",
            backdrop: "bg-black/90",
          }}
        >
          <ModalContent>
            <div className="relative md:w-full md:h-full w-screen h-screen flex items-center justify-center md:p-4 p-0">
              {/* Image principale */}
              <div className="relative md:max-w-full md:max-h-full flex items-center justify-center">
                <img
                  src={chalet.images[lightboxImageIndex]}
                  alt={`${chalet.name} - Photo ${lightboxImageIndex + 1}`}
                  className="md:max-w-full md:max-h-[90vh] max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
                  loading="eager"
                />
              </div>

              {/* Bouton fermer */}
              <Button
                isIconOnly
                variant="flat"
                size="md"
                className="absolute top-4 right-4 z-50 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 border border-white/20 rounded-full transition-all duration-200 m-2"
                onPress={() => setLightboxOpen(false)}
              >
                <BsX size={20} />
              </Button>

              {/* Contrôles navigation */}
              {chalet.images.length > 1 && (
                <>
                  <Button
                    isIconOnly
                    variant="flat"
                    size="md"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 border border-white/20 rounded-full transition-all duration-200 hover:scale-110 m-2"
                    onPress={() =>
                      setLightboxImageIndex(
                        (prev) =>
                          (prev - 1 + chalet.images.length) %
                          chalet.images.length
                      )
                    }
                  >
                    <BsChevronLeft size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="flat"
                    size="md"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/40 backdrop-blur-md text-white hover:bg-black/60 border border-white/20 rounded-full transition-all duration-200 hover:scale-110 m-2"
                    onPress={() =>
                      setLightboxImageIndex(
                        (prev) => (prev + 1) % chalet.images.length
                      )
                    }
                  >
                    <BsChevronRight size={18} />
                  </Button>

                  {/* Indicateurs */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-50">
                    {chalet.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === lightboxImageIndex
                            ? "bg-white scale-110"
                            : "bg-white/60 hover:bg-white/80"
                        }`}
                        onClick={() => setLightboxImageIndex(index)}
                      />
                    ))}
                  </div>

                  {/* Compteur */}
                  <div className="absolute bottom-6 right-6 z-50 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-sm">
                    {lightboxImageIndex + 1} / {chalet.images.length}
                  </div>
                </>
              )}
            </div>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
