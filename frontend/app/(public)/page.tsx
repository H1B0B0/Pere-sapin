"use client";

import { Link, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsTree,
  BsHouseDoor,
  BsStars,
  BsGift,
  BsTelephone,
  BsEnvelope,
} from "react-icons/bs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold mb-4 font-display">
          <span className="gradient-festive bg-clip-text text-transparent flex items-center justify-center gap-3">
            <BsTree className="h-16 w-16 text-primary" />
            Père Sapin
          </span>
        </h1>
        <p className="text-xl text-default-600 mb-8 max-w-2xl">
          Bienvenue chez Père Sapin ! Découvrez nos chalets authentiques et
          profitez d’un séjour inoubliable dans un cadre naturel exceptionnel,
          au cœur des montagnes Vosgiennes, toute l’année.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            className="font-semibold btn-alpine text-primary-foreground"
            color="primary"
            href="/chalets"
            size="lg"
          >
            Découvrir nos chalets
          </Button>
          <Button
            as={Link}
            className="font-semibold backdrop-blur-sm"
            href="/about"
            size="lg"
            variant="bordered"
          >
            En savoir plus
          </Button>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
        initial={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-0 flex flex-col items-center">
            <BsHouseDoor className="h-8 w-8 text-primary mb-2" />
            <h3 className="text-xl font-bold text-center w-full font-display">
              Chalets Authentiques
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Des chalets traditionnels dans un cadre féérique, parfaits pour
              vos vacances de Noël en famille.
            </p>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardHeader className="pb-0 flex flex-col items-center">
            <BsStars className="h-8 w-8 text-primary mb-2" />
            <h3 className="text-xl font-bold text-center w-full font-display">
              Expérience Magique
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Plongez dans l'atmosphère unique de Noël avec des activités
              spéciales et des surprises.
            </p>
          </CardBody>
        </Card>

        <Card className="alpine-card">
          <CardHeader className="pb-0 flex flex-col items-center">
            <BsGift className="h-8 w-8 text-primary mb-2" />
            <h3 className="text-xl font-bold text-center w-full font-display">
              Service Premium
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Un service personnalisé pour rendre votre séjour inoubliable, du
              petit-déjeuner aux activités.
            </p>
          </CardBody>
        </Card>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        animate={{ opacity: 1 }}
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="alpine-card">
          <CardBody className="p-8">
            <h2 className="text-3xl font-bold mb-4 font-display">
              Prêt pour l'aventure ?
            </h2>
            <p className="text-lg text-default-600 mb-6">
              Contactez-nous directement pour réserver votre chalet et préparer
              votre séjour sur mesure !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as={Link}
                className="font-semibold btn-success text-white flex items-center gap-2"
                color="success"
                href="tel:+33611233767"
                size="lg"
              >
                <BsTelephone className="h-5 w-5" />
                Appeler M. STEPHAN
              </Button>
              <Button
                as={Link}
                className="font-semibold backdrop-blur-sm flex items-center gap-2"
                color="primary"
                href="/contact"
                size="lg"
                variant="flat"
              >
                <BsEnvelope className="h-5 w-5" />
                Nous contacter
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
