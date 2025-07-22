"use client";

import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BsTree } from "react-icons/bs";
import { FaStar, FaHandshake, FaPhoneAlt, FaMobileAlt, FaTrophy } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GiMountains, GiPineTree } from "react-icons/gi";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4 font-display gradient-festive bg-clip-text text-transparent flex items-center justify-center gap-3">
          <BsTree className="h-10 w-10 text-primary" />À
          propos du Père Sapin
        </h1>
        <p className="text-xl text-default-600 max-w-3xl mx-auto">
          Découvrez l'histoire de nos chalets d'exception dans les Vosges et
          notre passion pour l'accueil de qualité.
        </p>
      </motion.div>

      {/* Histoire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2"><GiMountains className="text-primary" /> Notre Histoire</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-default-600">
              Nichés au cœur des magnifiques Vosges, nos chalets du Père Sapin
              vous accueillent dans un cadre exceptionnel pour des vacances
              inoubliables. Chaque chalet a été pensé et aménagé avec soin pour
              offrir à nos hôtes une expérience unique alliant confort moderne
              et charme traditionnel.
            </p>
            <p className="text-default-600">
              Nos quatre chalets - Cèdre, Épicéa, Mélèze et Douglas - sont tous
              classés 3 étoiles et proposent des équipements haut de gamme :
              jacuzzi, sauna, espaces de jeux, et bien plus encore.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Nos valeurs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="alpine-card">
          <CardHeader className="text-center">
            <h3 className="text-xl font-bold font-display flex items-center justify-center gap-2"><FaStar className="text-warning" /> Qualité</h3>
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
            <h3 className="text-xl font-bold font-display flex items-center justify-center gap-2"><FaHandshake className="text-success" /> Service</h3>
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
            <h3 className="text-xl font-bold font-display flex items-center justify-center gap-2"><GiPineTree className="text-success" /> Nature</h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Au cœur des Vosges, un environnement préservé pour se ressourcer.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* Classifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2"><FaTrophy className="text-warning" /> Nos Classifications</h2>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <Card className="alpine-card">
          <CardBody className="p-8">
            <h2 className="text-3xl font-bold mb-4 font-display flex items-center justify-center gap-2"><FaPhoneAlt className="text-primary" /> Contactez-nous</h2>
            <p className="text-lg text-default-600 mb-6">
              Une question ? Un projet de séjour ? N'hésitez pas à nous
              contacter pour une demande personnalisée.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button color="primary" size="lg" className="font-semibold btn-alpine text-primary-foreground">
                <MdEmail className="mr-2" /> Nous écrire
              </Button>
              <Button
                color="success"
                variant="flat"
                size="lg"
                className="font-semibold backdrop-blur-sm"
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
