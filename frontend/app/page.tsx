"use client";

import { Link, Button, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { BsTree } from "react-icons/bs";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-green-600 to-red-600 dark:from-green-400 dark:to-red-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <BsTree className="h-16 w-16 text-green-600 dark:text-green-400" />
            Père Sapin
          </span>
        </h1>
        <p className="text-xl text-default-600 mb-8 max-w-2xl">
          Bienvenue dans l'univers magique du Père Sapin ! Découvrez nos chalets
          enchantés et vivez une expérience inoubliable pendant les fêtes de fin
          d'année.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            href="/chalets"
            color="primary"
            size="lg"
            className="font-semibold"
          >
            Découvrir nos chalets
          </Button>
          <Button
            as={Link}
            href="/about"
            variant="bordered"
            size="lg"
            className="font-semibold"
          >
            En savoir plus
          </Button>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl"
      >
        <Card className="border-none shadow-md">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-bold text-center w-full">
              🏠 Chalets Authentiques
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Des chalets traditionnels dans un cadre féérique, parfaits pour
              vos vacances de Noël en famille.
            </p>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-bold text-center w-full">
              ✨ Expérience Magique
            </h3>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600">
              Plongez dans l'atmosphère unique de Noël avec des activités
              spéciales et des surprises.
            </p>
          </CardBody>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-bold text-center w-full">
              🎁 Service Premium
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <Card className=" border-none">
          <CardBody className="p-8">
            <h2 className="text-3xl font-bold mb-4">Prêt pour l'aventure ?</h2>
            <p className="text-lg text-default-600 mb-6">
              Contactez-nous directement pour réserver votre chalet et préparer
              votre séjour sur mesure !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                as={Link}
                href="tel:+33611233767"
                color="success"
                size="lg"
                className="font-semibold"
              >
                📞 Appeler M. STEPHAN
              </Button>
              <Button
                as={Link}
                href="/contact"
                color="primary"
                variant="flat"
                size="lg"
                className="font-semibold"
              >
                📧 Nous contacter
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
