"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Image,
  Link,
  Skeleton,
  Spinner,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsTree,
  BsArrowRight,
  BsPhone,
  BsPeople,
  BsStars,
  BsHeart,
  BsCalendar,
} from "react-icons/bs";
import { FaWifi, FaParking, FaPaw, FaFire } from "react-icons/fa";
import { GiMountains } from "react-icons/gi";
import { MdLocationOn, MdEmail } from "react-icons/md";

import { getAllChaletsClient } from "@/lib/services/client-chalets";
import { getAvailablePeriodsForChaletClient } from "@/lib/services/client-availability";
import { Chalet, Availability } from "@/types";

const ChaletCard = ({ chalet, index }: { chalet: Chalet; index: number }) => {
  const [nextAvailable, setNextAvailable] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const availabilities = await getAvailablePeriodsForChaletClient(
          chalet._id,
          today
        );

        if (availabilities.length > 0) {
          setNextAvailable(availabilities[0]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des disponibilités:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [chalet._id]);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full hover:shadow-xl transition-all duration-500 overflow-hidden group border border-divider hover:border-primary/30">
        {/* Image principale */}
        <div className="relative h-56 overflow-hidden">
          {chalet.mainImage ? (
            <Image
              alt={chalet.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              radius="none"
              src={chalet.mainImage}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
              <BsTree className="text-6xl text-primary/50" />
            </div>
          )}

          {/* Overlay avec badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute top-3 left-3">
              {loading ? (
                <Spinner size="sm" />
              ) : (
                nextAvailable && (
                  <Chip color="success" size="sm" variant="solid">
                    <BsCalendar className="mr-1" />
                    Disponible
                  </Chip>
                )
              )}
            </div>

            {chalet.pricePerNight && (
              <div className="absolute bottom-3 right-3 text-right">
                <div className="bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="text-xs text-muted-foreground">
                    À partir de
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {chalet.pricePerNight}€
                    <span className="text-sm font-normal">/nuit</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <CardBody className="p-4 space-y-3">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <GiMountains className="text-primary" />
                {chalet.name}
              </h3>
              <div className="flex items-center gap-1 text-sm">
                <BsStars className="h-4 w-4 text-primary" />
                <span className="font-medium">3★</span>
              </div>
            </div>

            {chalet.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <MdLocationOn className="h-3 w-3" />
                {chalet.location}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {chalet.capacity && (
                <div className="flex items-center gap-1">
                  <BsPeople className="h-4 w-4" />
                  <span>{chalet.capacity} personnes</span>
                </div>
              )}
            </div>
          </div>

          {chalet.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {chalet.description}
            </p>
          )}

          {chalet.amenities && chalet.amenities.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {chalet.amenities.slice(0, 3).map((amenity, idx) => (
                <Chip key={idx} size="sm" variant="flat">
                  {amenity}
                </Chip>
              ))}
              {chalet.amenities.length > 3 && (
                <Chip size="sm" variant="flat">
                  +{chalet.amenities.length - 3}
                </Chip>
              )}
            </div>
          )}

          {nextAvailable && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-3">
              <div className="text-success text-sm font-medium flex items-center gap-2">
                <BsCalendar className="h-4 w-4" />
                Prochaine disponibilité
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Du{" "}
                {new Date(nextAvailable.startDate).toLocaleDateString("fr-FR")}
                au {new Date(nextAvailable.endDate).toLocaleDateString("fr-FR")}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              as={Link}
              className="flex-1"
              color="primary"
              endContent={<BsArrowRight />}
              href={`/chalets/${chalet._id}`}
              variant="solid"
            >
              Découvrir
            </Button>
            {chalet.contactPhone && (
              <Button
                isIconOnly
                as={Link}
                color="success"
                href={`tel:${chalet.contactPhone}`}
                variant="flat"
              >
                <BsPhone />
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default function ChaletsPageClient() {
  const [chalets, setChalets] = useState<Chalet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChalets = async () => {
      try {
        const data = await getAllChaletsClient();

        setChalets(data.filter((chalet) => chalet.isActive));
      } catch (error) {
        console.error("Erreur lors du chargement des chalets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChalets();
  }, []);

  if (loading) {
    const skeletonCards = Array.from({ length: 6 });

    return (
      <div className="space-y-12">
        {/* Hero skeleton */}
        <div className="text-center space-y-6">
          <Skeleton className="mx-auto h-14 w-72 rounded-lg" />
          <div className="space-y-3 max-w-4xl mx-auto">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="h-4 w-2/3 rounded-lg" />
          </div>
          <div className="flex justify-center gap-6 flex-wrap mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-32 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {skeletonCards.map((_, i) => (
            <Card key={i} className="h-full space-y-4 p-4">
              <Skeleton className="rounded-lg">
                <div className="h-56 w-full rounded-lg bg-default-200" />
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-4 w-full bg-default-200" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-4 w-full bg-default-200" />
                </Skeleton>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-6 font-display gradient-festive bg-clip-text text-transparent">
          Nos Chalets d'Exception
        </h1>
        <p className="text-xl text-default-600 max-w-4xl mx-auto mb-8">
          Découvrez nos magnifiques chalets dans les Vosges. Chaque chalet offre
          une expérience unique avec des équipements de qualité pour des
          vacances inoubliables.
        </p>

        {/* Stats rapides */}
        <div className="flex justify-center items-center gap-8 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {chalets.length}
            </div>
            <div className="text-sm text-default-600">Chalets disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">3★</div>
            <div className="text-sm text-default-600">Qualité garantie</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {Math.min(
                ...chalets.filter((c) => c.capacity).map((c) => c.capacity!)
              )}{" "}
              -
              {Math.max(
                ...chalets.filter((c) => c.capacity).map((c) => c.capacity!)
              )}
            </div>
            <div className="text-sm text-default-600">Couchages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-default-600">Équipés</div>
          </div>
        </div>
      </motion.div>

      {/* Grille des chalets */}
      {chalets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chalets.map((chalet, index) => (
            <ChaletCard key={chalet._id} chalet={chalet} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BsTree className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Aucun chalet disponible
          </h3>
          <p className="text-muted-foreground">
            Revenez bientôt pour découvrir nos chalets !
          </p>
        </div>
      )}

      {/* CTA Section */}
      {chalets.length > 0 && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 to-success/5">
            <CardBody className="p-8 text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-bold font-display flex items-center justify-center gap-3">
                  <BsHeart className="text-primary" />
                  Votre séjour parfait vous attend
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Contact direct propriétaire • Sans commission • Réponse rapide
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  as={Link}
                  className="font-semibold"
                  color="primary"
                  href="/contact"
                  size="lg"
                  startContent={<MdEmail />}
                >
                  Réserver maintenant
                </Button>
                <Button
                  as={Link}
                  className="font-semibold"
                  color="success"
                  href="tel:+33123456789"
                  size="lg"
                  startContent={<BsPhone />}
                  variant="flat"
                >
                  Appeler directement
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <GiMountains className="text-primary" />
                  <span>Au cœur des Vosges</span>
                </div>
                <div className="flex items-center gap-1">
                  <BsStars className="text-primary" />
                  <span>Qualité 3 étoiles</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
