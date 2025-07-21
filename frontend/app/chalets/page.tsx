"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Badge,
  Divider,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Skeleton,
  Link,
} from "@heroui/react";
import { motion } from "framer-motion";
import { chaletService } from "@/lib/services/chalets";
import { Chalet } from "@/types";
import { BsTree } from "react-icons/bs";

// Données des chalets basées sur le site officiel chaletduperesapin.fr
const chaletData = [
  {
    name: "CÈDRE",
    capacity: "8-10 couchages",
    rooms: "3 chambres",
    images: [
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613cc22398f1a.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613ccf37ebb09.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613cc2b6a80c1.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adcbe48fd05.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b8a8b2e.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b6b7f3c.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b4c96ea.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adb5b2de8f8.jpg",
    ],
    features: [
      "TV dans chaque chambre",
      "Jacuzzi + 5 peignoirs",
      "Poêle à pellets",
      "Baby-foot de bar",
      "Borne tactile",
      "Plancha extérieure",
      "Table de ping-pong",
      "Parking privé",
      "Karaoké",
      "Jeu de fléchettes",
      "Table de palet Hair Hockey",
      "Tireuse à bière Perfect Draft",
      "Frigo américain",
      "Château gonflable (été)",
      "Machine à laver",
      "Balançoire extérieur",
    ],
    highlights: [
      "Chalet 3 étoiles",
      "Classé Destinations Vosges",
      "Classé Gîtes de France",
      "Linge fourni",
    ],
    prices: {
      weekend: "800-900€",
      week: "1100-1900€",
      holidays: "2200€",
      cleaning: "100€",
    },
    color: "success",
    icon: "🌲",
    bedrooms:
      "1 chambre 2 lits doubles + 1 chambre lit double + 1 chambre lit double et simple",
    bathrooms: "2 salles de bain (1 douche, 1 baignoire) + 2 toilettes",
  },
  {
    name: "ÉPICÉA",
    capacity: "15 couchages",
    rooms: "5 chambres",
    images: [
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137dbc36c177.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137dbe0e10b8.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137e0885801d.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adcb0486b21.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137e08a79fe6.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137e08ce0b45.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6c8cef7e.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6cbc76ec.jpg",
    ],
    features: [
      "Jacuzzi + Sauna",
      "Appareils de remise en forme",
      "Cheminée",
      "Juke-box",
      "Simulateur de voiture",
      "Machine à coup de poing",
      "Baby-foot de bar",
      "Terrain de boules",
      "Lave-verres professionnel",
      "Machine à glaçons",
      "Refroidisseur à bouteilles",
      "Tireuse à bière Perfect Draft",
      "Borne tactile",
      "Jeu de fléchettes",
      "Hair Hockey",
      "Karaoké",
      "Château gonflable (été)",
      "Barbecue extérieur",
    ],
    highlights: [
      "Chalet 3 étoiles",
      "Classé Destinations Vosges",
      "Espace détente complet",
      "Bar équipé professionnel",
    ],
    prices: {
      weekend: "1600€",
      week: "1900-2800€",
      holidays: "3200€",
      cleaning: "150€",
    },
    color: "primary",
    icon: "🏔️",
    bedrooms:
      "2 chambres lit double + 1 chambre lit double et simple + 2 chambres 2 lits doubles",
    bathrooms: "4 douches + 1 baignoire + 4 toilettes",
  },
  {
    name: "MÉLÈZE",
    capacity: "15 couchages",
    rooms: "5 chambres",
    images: [
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137d1c8683c9.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6137d1fbecc04.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos613cb12e9ac2c.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc70380583.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc7016e0e6.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6ff5b8f4.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6fd4a702.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos61adc6fb39510.jpg",
    ],
    features: [
      "Jacuzzi",
      "Cheminée",
      "Karaoké",
      "Simulateur rallye",
      "Time Crisis original",
      "Hair Hockey",
      "Tape taupe",
      "Machine à glaçons",
      "Refroidisseur à bouteilles",
      "Tireuse à bière Perfect Draft",
      "Borne tactile",
      "Baby-foot de bar",
      "Jeu de fléchettes",
      "Château gonflable (été)",
      "Barbecue extérieur",
      "Terrain de boules",
      "Machine à laver",
      "Balançoire extérieur",
    ],
    highlights: [
      "Chalet 3 étoiles Gîtes de France",
      "Simulateurs uniques",
      "Espace jeux complet",
      "Équipements modernes",
    ],
    prices: {
      weekend: "1600€",
      week: "1900-2600€",
      holidays: "3200€",
      cleaning: "150€",
    },
    color: "warning",
    icon: "🍂",
    bedrooms:
      "2 chambres lit double + 1 chambre lit double et simple + 2 chambres 2 lits doubles",
    bathrooms: "5 douches + 1 baignoire + 3 toilettes",
  },
  {
    name: "DOUGLAS",
    capacity: "15 couchages",
    rooms: "5 chambres",
    images: [
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671f7d3ed8ed.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671f7d58a253.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671f7d72f1ec.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671fedf99008.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff655cd71.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff67447af.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff6933d4d.jpg",
      "http://chaletduperesapin.fr/clients/_1/_1/16960/images/photos/clients_photos6671ff6b228eb.jpg",
    ],
    features: [
      "NOUVEAU chalet",
      "Salle de jeux 100m²",
      "Jacuzzi privé",
      "Poêle à pellets",
      "Baby-foot de bar",
      "Jeu de fléchettes",
      "Borne tactile",
      "Jeu de palet",
      "Jeu de frappe fête foraine",
      "Jeu basket SEGA",
      "Jeu de danse",
      "Bowling électronique",
      "Jeu de réflexes",
      "Château gonflable (été)",
      "Grande plancha extérieur",
      "Terrasse et bains de soleil",
      "Chambre PMR",
      "Enceinte JBL connectable",
    ],
    highlights: [
      "Dernier né - 2024",
      "Salle de jeux unique 100m²",
      "Chambre PMR accessible",
      "Équipements premium",
    ],
    prices: {
      weekend: "1850€",
      week: "2200-2900€",
      holidays: "3600€",
      cleaning: "150€",
    },
    color: "secondary",
    icon: "✨",
    bedrooms:
      "2 chambres lit double + 1 chambre lit double et simple + 1 chambre lit double et 2 lits simples + chambre PMR",
    bathrooms: "5 salles de bain avec douche + 4 toilettes",
  },
];

const ChaletCard = ({ chalet }: { chalet: (typeof chaletData)[0] }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card className="h-full alpine-card hover:shadow-xl transition-all duration-300">
          {/* Image carousel */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={chalet.images[currentImageIndex]}
              alt={`Chalet ${chalet.name}`}
              className="w-full h-full object-cover"
              radius="none"
            />
            {chalet.images.length > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="ml-2 bg-black/30 text-white"
                    onPress={() =>
                      setCurrentImageIndex(
                        (prev) =>
                          (prev - 1 + chalet.images.length) %
                          chalet.images.length
                      )
                    }
                  >
                    ‹
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="mr-2 bg-black/30 text-white"
                    onPress={() =>
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % chalet.images.length
                      )
                    }
                  >
                    ›
                  </Button>
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {chalet.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
            <div className="flex justify-between items-start w-full mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{chalet.icon}</span>
                <h3 className="text-2xl font-bold font-display">{chalet.name}</h3>
              </div>
              <Badge
                content="3★"
                color="warning"
                variant="solid"
                placement="top-right"
              >
                <Chip color={chalet.color as any} variant="flat" size="sm">
                  {chalet.capacity}
                </Chip>
              </Badge>
            </div>
            <p className="text-large text-default-600">{chalet.rooms}</p>
          </CardHeader>

          <CardBody className="px-6 pb-6">
            <div className="space-y-4">
              {/* Points forts */}
              <div>
                <h4 className="font-semibold mb-2 text-primary">
                  🌟 Points forts
                </h4>
                <div className="flex flex-wrap gap-1">
                  {chalet.highlights.map((highlight, index) => (
                    <Chip key={index} size="sm" variant="flat" color="primary">
                      {highlight}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Équipements (limités) */}
              <div>
                <h4 className="font-semibold mb-2 text-success">
                  🎯 Équipements
                </h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {chalet.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <span className="text-success">•</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                  {chalet.features.length > 6 && (
                    <div className="col-span-2 text-center">
                      <Chip
                        size="sm"
                        variant="flat"
                        color="default"
                        className="cursor-pointer"
                        onClick={onOpen}
                      >
                        +{chalet.features.length - 6} équipements
                      </Chip>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              {/* Tarifs */}
              <div>
                <h4 className="font-semibold mb-2 text-warning">
                  💰 Tarifs indicatifs
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Week-end:</span>
                    <span className="font-semibold">
                      {chalet.prices.weekend}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Semaine:</span>
                    <span className="font-semibold">{chalet.prices.week}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fêtes:</span>
                    <span className="font-semibold">
                      {chalet.prices.holidays}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  color={chalet.color as any}
                  variant="solid"
                  onPress={onOpen}
                  className="flex-1 btn-alpine text-primary-foreground"
                >
                  Voir plus
                </Button>
                <Button
                  as={Link}
                  href="tel:+33611233767"
                  color="success"
                  variant="flat"
                  className="flex-1 backdrop-blur-sm"
                >
                  📞 Contacter
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Modal détails */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{chalet.icon}</span>
                  <h2 className="text-2xl font-bold font-display">Chalet {chalet.name}</h2>
                </div>
                <p className="text-lg text-default-600">
                  {chalet.capacity} • {chalet.rooms}
                </p>
              </ModalHeader>
              <ModalBody>
                {/* Carrousel d'images */}
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={chalet.images[currentImageIndex]}
                    alt={`Chalet ${chalet.name}`}
                    className="w-full h-full object-cover"
                    radius="none"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="ml-2 bg-black/50 text-white"
                      onPress={() =>
                        setCurrentImageIndex(
                          (prev) =>
                            (prev - 1 + chalet.images.length) %
                            chalet.images.length
                        )
                      }
                    >
                      ‹
                    </Button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="mr-2 bg-black/50 text-white"
                      onPress={() =>
                        setCurrentImageIndex(
                          (prev) => (prev + 1) % chalet.images.length
                        )
                      }
                    >
                      ›
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {chalet.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "bg-white scale-110"
                            : "bg-white/60 hover:bg-white/80"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {currentImageIndex + 1} / {chalet.images.length}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Configuration des chambres */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">
                      🛏️ Configuration des chambres
                    </h3>
                    <p className="text-default-600 mb-2">{chalet.bedrooms}</p>
                    <p className="text-default-600">{chalet.bathrooms}</p>
                  </div>

                  <Divider />

                  {/* Points forts */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-warning">
                      🌟 Points forts
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {chalet.highlights.map((highlight, index) => (
                        <Chip
                          key={index}
                          color="warning"
                          variant="flat"
                          size="sm"
                        >
                          {highlight}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <Divider />

                  {/* Tous les équipements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-success">
                      🎯 Équipements complets
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {chalet.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-success text-sm">✓</span>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Divider />

                  {/* Tarifs détaillés */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-secondary">
                      💰 Tarifs détaillés
                    </h3>
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
                      <div className="flex justify-between items-center p-3 bg-default-50 dark:bg-default-100 rounded-lg">
                        <span className="font-medium">
                          Fêtes de fin d'année
                        </span>
                        <span className="font-bold text-lg text-warning">
                          {chalet.prices.holidays}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-default-50 dark:bg-default-100 rounded-lg">
                        <span className="font-medium">
                          Ménage (obligatoire)
                        </span>
                        <span className="font-bold text-lg">
                          {chalet.prices.cleaning}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-default-500 mt-3">
                      Tarifs indicatifs - Contactez M. STEPHAN pour une demande
                      personnalisée
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Fermer
                </Button>
                <Button
                  as={Link}
                  href="tel:+33611233767"
                  color="success"
                  variant="solid"
                >
                  📞 Appeler M. STEPHAN
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default function ChaletsPage() {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChalets = async () => {
      try {
        const data = await chaletService.getAll();
        setChalets(data);
      } catch (error) {
        console.error("Erreur lors du chargement des chalets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChalets();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 font-display">
          <span className="gradient-festive bg-clip-text text-transparent">
            🏔️ Nos Chalets d'Exception
          </span>
        </h1>
        <p className="text-xl text-default-600 max-w-3xl mx-auto">
          Découvrez nos magnifiques chalets 3 étoiles dans les Vosges. Chaque
          chalet offre une expérience unique avec des équipements de qualité
          pour des vacances inoubliables.
        </p>
      </motion.div>

      {/* Infos importantes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 font-display">
                  ℹ️ Informations importantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>• Chalets classés 3 étoiles</div>
                  <div>• Résidences secondaires déclarées</div>
                  <div>• Non fumeur</div>
                  <div>• Forfait ménage obligatoire</div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="text-sm text-default-600">
                  <strong>Contact direct :</strong>
                  <br />
                  M. STEPHAN (Propriétaire)
                </div>
                <Button
                  color="primary"
                  variant="flat"
                  as={Link}
                  href="tel:+33611233767"
                  className="backdrop-blur-sm"
                >
                  📞 06 11 23 37 67
                </Button>
                <div className="text-xs text-warning-600">
                  ⚠️ Évitez les commissions LeBonCoin
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Grille des chalets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chaletData.map((chalet, index) => (
          <motion.div
            key={chalet.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <ChaletCard chalet={chalet} />
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center"
      >
        <Card className="alpine-card">
          <CardBody className="p-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3 font-display">
              <BsTree className="h-8 w-8 text-primary" />
              Prêt pour l'aventure ?
            </h2>
            <p className="text-lg text-default-600 mb-6">
              Tous nos chalets sont équipés pour vous offrir une expérience
              unique. Contactez-nous pour personnaliser votre séjour !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button color="success" size="lg" className="font-semibold btn-success text-white">
                📧 Demande personnalisée
              </Button>
              <Button
                color="primary"
                variant="flat"
                size="lg"
                className="font-semibold backdrop-blur-sm"
              >
                📋 Voir les disponibilités
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Section chalets depuis l'API (si disponibles) */}
      {!loading && chalets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-display">
              📝 Guides & Explications
            </h2>
            <p className="text-lg text-default-600">
              Accédez aux guides d'utilisation des équipements de chaque chalet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chalets.map((chalet) => (
              <Card
                key={chalet._id}
                className="alpine-card hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <h3 className="text-xl font-semibold font-display">{chalet.name}</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-default-600 mb-4">
                    {chalet.description ||
                      "Guides d'utilisation des équipements"}
                  </p>
                  <div className="flex justify-between items-center">
                    <Chip size="sm" variant="flat">
                      {chalet.pages?.length || 0} guide(s)
                    </Chip>
                    <Button size="sm" color="primary" variant="flat" className="backdrop-blur-sm">
                      Voir les guides
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
