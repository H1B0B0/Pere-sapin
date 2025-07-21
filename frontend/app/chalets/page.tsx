"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Badge,
  Image,
  Link,
} from "@heroui/react";
import { motion } from "framer-motion";
import { chaletData } from "@/data/chalets";
import {
  BsTree,
  BsArrowRight,
  BsPhone,
  BsPeople,
  BsDoorOpen,
  BsStars,
  BsGeoAlt,
} from "react-icons/bs";

const ChaletPreviewCard = ({ chalet, index }: { chalet: (typeof chaletData)[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Card className="h-full alpine-card hover:shadow-2xl transition-all duration-500 overflow-hidden group">
        {/* Image principale avec overlay */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={chalet.images[0]}
            alt={`Chalet ${chalet.name}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            radius="none"
          />
          
          {/* Overlay avec informations */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <div className="absolute top-4 right-4">
              <Badge content="3★" color="warning" placement="top-right">
                <Chip color={chalet.color as any} variant="solid" className="text-white">
                  {chalet.capacity}
                </Chip>
              </Badge>
            </div>
            
            {/* Prix en bas à droite */}
            <div className="absolute bottom-4 right-4 text-right">
              <div className="text-white/80 text-xs">À partir de</div>
              <div className="text-xl font-bold text-white">
                {chalet.prices.weekend.split('-')[0]}
              </div>
            </div>

            {/* Nouveau badge si Douglas */}
            {chalet.name === "DOUGLAS" && (
              <div className="absolute top-4 left-4">
                <Chip color="secondary" variant="solid" size="sm">
                  ✨ NOUVEAU 2024
                </Chip>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <CardHeader className="pb-2">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{chalet.icon}</span>
                <h3 className="text-2xl font-bold font-display">{chalet.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-default-600">
              <div className="flex items-center gap-1">
                <BsDoorOpen className="h-4 w-4" />
                <span>{chalet.rooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <BsPeople className="h-4 w-4" />
                <span>{chalet.capacity}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="pt-0 space-y-4">
          {/* Description */}
          <p className="text-default-600 text-sm line-clamp-2">
            {chalet.description}
          </p>

          {/* Points forts */}
          <div>
            <h4 className="font-semibold mb-2 text-primary flex items-center gap-1">
              <BsStars className="h-4 w-4" />
              Points forts
            </h4>
            <div className="flex flex-wrap gap-1">
              {chalet.highlights.slice(0, 3).map((highlight, idx) => (
                <Chip key={idx} size="sm" variant="flat" color="primary">
                  {highlight}
                </Chip>
              ))}
              {chalet.highlights.length > 3 && (
                <Chip size="sm" variant="flat" color="default">
                  +{chalet.highlights.length - 3}
                </Chip>
              )}
            </div>
          </div>

          {/* Équipements phares */}
          <div>
            <h4 className="font-semibold mb-2 text-success">🎯 Équipements phares</h4>
            <div className="text-sm text-default-600">
              {chalet.features.slice(0, 3).join(" • ")}
              <span className="text-primary font-medium"> et {chalet.features.length - 3} autres...</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              as={Link}
              href={`/chalets/${chalet.slug}`}
              color="primary"
              variant="solid"
              className="flex-1 btn-alpine text-primary-foreground"
              endContent={<BsArrowRight />}
            >
              Découvrir
            </Button>
            <Button
              as={Link}
              href="tel:+33611233767"
              color="success"
              variant="flat"
              className="backdrop-blur-sm"
              isIconOnly
            >
              <BsPhone />
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default function ChaletsPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold mb-6 font-display gradient-festive bg-clip-text text-transparent">
          Nos Chalets d'Exception
        </h1>
        <p className="text-xl text-default-600 max-w-4xl mx-auto mb-8">
          Découvrez nos magnifiques chalets 3 étoiles dans les Vosges. Chaque chalet offre une expérience unique 
          avec des équipements de qualité pour des vacances inoubliables.
        </p>
        
        {/* Stats rapides */}
        <div className="flex justify-center items-center gap-8 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4</div>
            <div className="text-sm text-default-600">Chalets uniques</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">3★</div>
            <div className="text-sm text-default-600">Classement officiel</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">8-15</div>
            <div className="text-sm text-default-600">Couchages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-default-600">Équipés</div>
          </div>
        </div>
      </motion.div>

      {/* Informations importantes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="alpine-card">
          <CardBody className="p-6">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-4 font-display flex items-center gap-2">
                  <BsGeoAlt className="text-primary" />
                  Informations importantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span>Chalets classés 3 étoiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span>Résidences secondaires déclarées</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span>Non fumeur (extérieur autorisé)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-success">✓</span>
                    <span>Linge et équipements fournis</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center lg:text-right space-y-3 bg-primary/5 p-4 rounded-xl">
                <div className="text-sm text-default-600">
                  <strong>Contact direct propriétaire :</strong>
                  <br />
                  M. STEPHAN
                </div>
                <Button
                  as={Link}
                  href="tel:+33611233767"
                  color="primary"
                  className="btn-alpine text-primary-foreground"
                  startContent={<BsPhone />}
                >
                  06 11 23 37 67
                </Button>
                <div className="text-xs text-warning-600 bg-warning-50 dark:bg-warning-950/50 px-3 py-2 rounded-lg">
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
          <ChaletPreviewCard key={chalet.id} chalet={chalet} index={index} />
        ))}
      </div>

      {/* Section CTA finale */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center"
      >
        <Card className="alpine-card">
          <CardBody className="p-8">
            <h2 className="text-3xl font-bold mb-4 font-display flex items-center justify-center gap-3">
              <BsTree className="h-8 w-8 text-primary" />
              Prêt pour votre séjour dans les Vosges ?
            </h2>
            <p className="text-lg text-default-600 mb-6 max-w-2xl mx-auto">
              Tous nos chalets sont équipés pour vous offrir une expérience unique. 
              Contactez-nous pour personnaliser votre séjour et découvrir nos disponibilités.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                as={Link}
                href="tel:+33611233767"
                color="success" 
                size="lg" 
                className="font-semibold btn-success text-white"
                startContent={<BsPhone />}
              >
                Appel direct - Réservation immédiate
              </Button>
              <Button
                as={Link}
                href="/contact"
                color="primary"
                variant="flat"
                size="lg"
                className="font-semibold backdrop-blur-sm"
              >
                Demande personnalisée
              </Button>
            </div>
            <p className="text-xs text-default-500 mt-4">
              💬 Réponse garantie sous 24h • 🏔️ Au cœur des Vosges
            </p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}