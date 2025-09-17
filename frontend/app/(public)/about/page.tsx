"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BsTree } from "react-icons/bs";
import {
  FaStar,
  FaHandshake,
  FaPhoneAlt,
  FaMobileAlt,
  FaTrophy,
  FaLeaf,
  FaMountain,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GiMountains, GiPineTree } from "react-icons/gi";

export default function AboutPage() {
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
          <BsTree className="h-10 w-10 text-primary" />À propos du Père Sapin
        </h1>
        <p className="text-xl text-default-600 max-w-3xl mx-auto">
          Découvrez l&#39;histoire de nos chalets d&#39;exception dans les
          Vosges et notre passion pour l&#39;accueil de qualité.
        </p>
      </motion.div>

      {/* Histoire */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <GiMountains className="text-primary" /> Notre Histoire
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-default-600">
              C&#39;est en 1995 que M. STEPHAN a eu l&#39;idée de créer ces
              chalets d&#39;exception dans les Vosges, motivé par sa passion
              pour la montagne et l&#39;accueil de qualité. Ancien guide de
              montagne et amoureux de la nature, il souhaitait offrir aux
              familles et groupes d&#39;amis un lieu unique pour se ressourcer
              et créer des souvenirs inoubliables.
            </p>
            <p className="text-default-600">
              Situés à Cornimont, à seulement 12 km de Gérardmer et 8 km de la
              Bresse, nos chalets bénéficient d&#39;un emplacement privilégié au
              cœur du massif vosgien. Chaque construction a été pensée dans le
              respect de l&#39;environnement, utilisant des matériaux locaux et
              des techniques traditionnelles revisitées.
            </p>
            <p className="text-default-600">
              Aujourd&#39;hui, nos quatre chalets - Cèdre, Épicéa, Mélèze et
              Douglas - portent chacun le nom d&#39;une essence d&#39;arbre
              emblématique de nos forêts vosgiennes. Tous classés 3 étoiles, ils
              proposent des équipements haut de gamme : jacuzzi, sauna
              finlandais, espaces de jeux, cheminée à foyer ouvert, et une
              décoration soignée alliant authenticité et modernité.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Nos valeurs */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="alpine-card">
          <CardHeader className="text-center">
            <h3 className="text-xl font-bold font-display flex items-center justify-center gap-2">
              <FaStar className="text-warning" /> Qualité
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Chalets 3 étoiles avec équipements haut de gamme pour un confort
              optimal.
            </p>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardHeader className="text-center">
            <h3 className="text-xl font-bold font-display flex items-center justify-center gap-2">
              <FaHandshake className="text-success" /> Service
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Un accueil personnalisé et des conseils pour profiter au mieux de
              votre séjour.
            </p>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardHeader className="text-center">
            <h3 className="text-xl font-bold font-display flex items-center justify-center gap-2">
              <GiPineTree className="text-success" /> Nature
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Au cœur des Vosges, un environnement préservé pour se ressourcer.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Environnement et Activités */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <GiPineTree className="text-success" /> Un Environnement Préservé
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <FaLeaf className="text-success" />
                  En toutes saisons
                </h3>
                <p className="text-sm text-default-600">
                  <strong>Été :</strong> Randonnées sur les crêtes vosgiennes,
                  VTT, pêche dans les lacs, découverte de la Route des Crêtes et
                  des fermes-auberges traditionnelles.
                </p>
                <p className="text-sm text-default-600">
                  <strong>Hiver :</strong> Ski alpin et de fond, raquettes,
                  luge, marchés de Noël authentiques de Gérardmer et
                  Kaysersberg, ambiance féerique des Vosges enneigées.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <FaMountain className="text-primary" />
                  Sites incontournables
                </h3>
                <p className="text-sm text-default-600">
                  <strong>À proximité :</strong> Lac de Gérardmer (15 min), Parc
                  naturel régional des Ballons des Vosges, Cascade du Saut des
                  Cuves, Col de la Schlucht, et les célèbres marcaires (fermes
                  d&#39;altitude).
                </p>
                <p className="text-sm text-default-600">
                  <strong>Gastronomie :</strong> Dégustez les spécialités
                  locales : munster fermier, myrtilles des Vosges, kirsch, et
                  plats traditionnels dans nos auberges de montagne.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Classifications */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2">
              <FaTrophy className="text-warning" /> Nos Classifications
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Chip color="warning" variant="solid">
                    3★
                  </Chip>
                  <span className="font-semibold">Gîtes de France</span>
                </div>
                <div className="flex items-center gap-3">
                  <Chip color="warning" variant="solid">
                    3★
                  </Chip>
                  <span className="font-semibold">Destinations Vosges</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-default-600">
                  Nos chalets sont officiellement classés 3 étoiles par les
                  organismes de référence, garantissant un niveau de confort et
                  de service élevé.
                </p>
                <p className="text-sm text-default-600">
                  Résidences secondaires déclarées en mairie, conformes à la
                  réglementation.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Contact */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="alpine-card">
          <CardBody className="p-8">
            <h2 className="text-3xl font-bold mb-4 font-display flex items-center justify-center gap-2">
              <FaPhoneAlt className="text-primary" /> Contactez-nous
            </h2>
            <p className="text-lg text-default-600 mb-6">
              Une question ? Un projet de séjour ? N&#39;hésitez pas à nous
              contacter pour une demande personnalisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="font-semibold btn-alpine text-primary-foreground"
                color="primary"
                size="lg"
              >
                <MdEmail className="mr-2" /> Nous écrire
              </Button>
              <Button
                className="font-semibold backdrop-blur-sm"
                color="success"
                size="lg"
                variant="flat"
              >
                <FaMobileAlt className="mr-2" /> Voir les chalets
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
