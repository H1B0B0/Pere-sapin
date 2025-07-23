"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BsGeoAlt, BsPhone, BsLightbulb } from "react-icons/bs";
import { FaHandshakeSimple } from "react-icons/fa6";
import {
  FaSkiing,
  FaUtensils,
  FaShoppingCart,
  FaHiking,
  FaSpa,
  FaCar,
  FaPhoneAlt,
} from "react-icons/fa";
import { GiMountains } from "react-icons/gi";
import Link from "next/link";

const partenaires = [
  {
    nom: "Domaine Skiable de la Bresse",
    categorie: "Activités Hiver",
    description:
      "Station de ski familiale avec 13 pistes, école de ski et location de matériel.",
    distance: "8 km",
    icone: FaSkiing,
    couleur: "primary",
    services: ["Ski alpin", "Ski de fond", "Location matériel", "École de ski"],
  },
  {
    nom: "Lac de Gérardmer",
    categorie: "Loisirs",
    description:
      "Le plus grand lac naturel des Vosges avec activités nautiques et promenades.",
    distance: "12 km",
    icone: FaHiking,
    couleur: "success",
    services: ["Pédalo", "Pêche", "Promenades", "Plage aménagée"],
  },
  {
    nom: "Ferme-Auberge du Gaschney",
    categorie: "Restauration",
    description:
      "Cuisine traditionnelle vosgienne dans un cadre authentique en altitude.",
    distance: "15 km",
    icone: FaUtensils,
    couleur: "warning",
    services: [
      "Spécialités vosgiennes",
      "Munster fermier",
      "Vue panoramique",
      "Terrasse",
    ],
  },
  {
    nom: "Centre Thermal de Plombières",
    categorie: "Bien-être",
    description:
      "Station thermale historique pour cure et détente avec soins spa.",
    distance: "25 km",
    icone: FaSpa,
    couleur: "secondary",
    services: ["Soins thermaux", "Spa", "Massages", "Hydrothérapie"],
  },
  {
    nom: "Marché de Gérardmer",
    categorie: "Commerce",
    description:
      "Marché traditionnel avec produits locaux, artisanat et spécialités.",
    distance: "12 km",
    icone: FaShoppingCart,
    couleur: "danger",
    services: ["Produits locaux", "Artisanat", "Fromages", "Miels des Vosges"],
  },
  {
    nom: "Location Vosges Auto",
    categorie: "Services",
    description:
      "Location de véhicules et équipements pour vos déplacements et activités.",
    distance: "5 km",
    icone: FaCar,
    couleur: "primary",
    services: [
      "Location voiture",
      "VTT",
      "Équipement hiver",
      "Livraison possible",
    ],
  },
];

export default function PartenairesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 font-display gradient-festive bg-clip-text text-transparent flex items-center justify-center gap-3">
          <FaHandshakeSimple className="h-10 w-10 text-primary" />
          Nos Partenaires
        </h1>
        <p className="text-xl text-default-600 max-w-3xl mx-auto">
          Découvrez nos partenaires locaux sélectionnés pour enrichir votre
          séjour dans les Vosges avec des expériences authentiques et de
          qualité.
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <GiMountains className="text-primary" />
              Un Réseau de Qualité
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-default-600">
              Depuis plus de 25 ans, nous avons tissé des liens privilégiés avec
              les acteurs locaux des Vosges qui partagent nos valeurs
              d'authenticité et de qualité. Ces partenariats nous permettent de
              vous offrir des tarifs préférentiels et des expériences sur-mesure
              pendant votre séjour.
            </p>
            <p className="text-default-600">
              N'hésitez pas à mentionner que vous séjournez aux Chalets du Père
              Sapin pour bénéficier d'avantages exclusifs chez nos partenaires !
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Grid des partenaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partenaires.map((partenaire, index) => (
          <motion.div
            key={partenaire.nom}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
          >
            <Card className="alpine-card h-full">
              <CardHeader className="pb-3">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <partenaire.icone
                      className={`text-2xl text-${partenaire.couleur}`}
                    />
                    <Chip
                      color={partenaire.couleur as any}
                      size="sm"
                      variant="flat"
                    >
                      {partenaire.categorie}
                    </Chip>
                  </div>
                  <h3 className="text-lg font-bold font-display text-left">
                    {partenaire.nom}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-default-500 mt-1">
                    <BsGeoAlt />
                    <span>{partenaire.distance} du chalet</span>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <p className="text-sm text-default-600 mb-4">
                  {partenaire.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-primary">
                    Services proposés :
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {partenaire.services.map((service, idx) => (
                      <Chip
                        key={idx}
                        className="text-xs"
                        size="sm"
                        variant="bordered"
                      >
                        {service}
                      </Chip>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Informations pratiques */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <BsPhone className="text-success" />
              Réservations et Informations
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <BsLightbulb className="text-warning" />
                  Conseils de M. STEPHAN
                </h3>
                <ul className="space-y-2 text-sm text-default-600">
                  <li>• Réservez vos activités à l'avance en haute saison</li>
                  <li>
                    • Mentionnez toujours votre séjour aux Chalets du Père Sapin
                  </li>
                  <li>
                    • Demandez les menus du jour dans nos fermes-auberges
                    partenaires
                  </li>
                  <li>• Profitez des forfaits découverte pour groupes</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                  <FaPhoneAlt className="text-success" />
                  Contact direct
                </h3>
                <p className="text-sm text-default-600 mb-4">
                  Pour toute réservation d'activité ou information sur nos
                  partenaires, contactez directement M. STEPHAN qui se fera un
                  plaisir de vous conseiller et d'organiser votre programme
                  sur-mesure.
                </p>
                <Button
                  as={Link}
                  className="btn-success text-white"
                  color="success"
                  href="tel:+33611233767"
                  startContent={<BsPhone />}
                >
                  Appeler M. STEPHAN
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
