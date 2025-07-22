"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Chip,
} from "@heroui/react";
import { motion } from "framer-motion";
import { 
  FaPhoneAlt, 
  FaUser, 
  FaCar, 
  FaSmokingBan,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaClock,
  FaQuestionCircle,
  FaReceipt,
  FaBroom
} from "react-icons/fa";
import { 
  MdEmail, 
  MdMap, 
  MdChat 
} from "react-icons/md";
import { 
  GiMountains 
} from "react-icons/gi";
import { 
  HiMail 
} from "react-icons/hi";

export default function ContactPage() {
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
          <FaPhoneAlt className="h-8 w-8" /> Contactez-nous
        </h1>
        <p className="text-xl text-default-600 max-w-3xl mx-auto">
          Une question ? Un projet de séjour ? Nous sommes là pour vous
          accompagner dans l'organisation de vos vacances parfaites.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de contact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="alpine-card">
            <CardHeader>
              <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                <HiMail className="text-primary" /> Demande de renseignements
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  placeholder="Votre prénom"
                  variant="bordered"
                />
                <Input label="Nom" placeholder="Votre nom" variant="bordered" />
              </div>

              <Input
                label="Email"
                placeholder="votre.email@exemple.com"
                type="email"
                variant="bordered"
              />

              <Input
                label="Téléphone"
                placeholder="06 12 34 56 78"
                type="tel"
                variant="bordered"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Dates souhaitées"
                  placeholder="Ex: 15-22 Décembre"
                  variant="bordered"
                />
                <Input
                  label="Nombre de personnes"
                  placeholder="Ex: 8 personnes"
                  type="number"
                  variant="bordered"
                />
              </div>

              <Textarea
                label="Votre message"
                placeholder="Décrivez votre projet de séjour, vos questions..."
                variant="bordered"
                minRows={4}
              />

              <Button
                color="primary"
                size="lg"
                className="w-full font-semibold btn-alpine text-primary-foreground"
              >
                <MdEmail className="mr-2" /> Envoyer ma demande
              </Button>

              <p className="text-xs text-default-500 text-center">
                Nous vous répondrons dans les plus brefs délais
              </p>
            </CardBody>
          </Card>
        </motion.div>

        {/* Informations de contact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Contact direct */}
          <Card className="alpine-card">
            <CardHeader>
              <h3 className="text-xl font-bold font-display flex items-center gap-2"><FaPhoneAlt className="text-success" /> Contact direct</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaUser className="text-2xl text-primary" />
                  <div>
                    <p className="font-semibold">M. STEPHAN</p>
                    <p className="text-sm text-default-600">Propriétaire</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MdEmail className="text-2xl text-success" />
                  <div>
                    <p className="font-semibold">
                      contact@chaletduperesapin.fr
                    </p>
                    <p className="text-sm text-default-600">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="text-2xl text-warning" />
                  <div>
                    <p className="font-semibold">06 XX XX XX XX</p>
                    <p className="text-sm text-default-600">7j/7 - 9h-20h</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Chip color="warning" variant="flat" size="sm">
                  <FaExclamationTriangle className="mr-1" /> Attention : Évitez les commissions LeBonCoin
                </Chip>
                <p className="text-xs text-default-500 mt-2">
                  Contactez-nous directement pour éviter les frais
                  supplémentaires
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Localisation */}
          <Card className="alpine-card">
            <CardHeader>
              <h3 className="text-xl font-bold font-display flex items-center gap-2"><FaMapMarkerAlt className="text-danger" /> Localisation</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <GiMountains className="text-2xl text-primary" />
                  <div>
                    <p className="font-semibold">Les Vosges</p>
                    <p className="text-sm text-default-600">France</p>
                  </div>
                </div>

                <div className="text-sm text-default-600">
                  <p>
                    Nos chalets sont situés au cœur des Vosges, dans un
                    environnement naturel préservé, idéal pour la détente et les
                    activités de montagne.
                  </p>
                </div>

                <Button
                  color="primary"
                  variant="flat"
                  size="sm"
                  className="w-full backdrop-blur-sm"
                >
                  <MdMap className="mr-2" /> Voir sur la carte
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Horaires */}
          <Card className="alpine-card">
            <CardHeader>
              <h3 className="text-xl font-bold font-display flex items-center gap-2"><FaClock className="text-warning" /> Disponibilité</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Lundi - Vendredi:</span>
                  <span className="font-semibold">9h - 20h</span>
                </div>
                <div className="flex justify-between">
                  <span>Week-end:</span>
                  <span className="font-semibold">10h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span>Urgences:</span>
                  <span className="font-semibold">7j/7</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg">
                <p className="text-xs text-center flex items-center justify-center gap-1">
                  <MdChat /> Réponse garantie sous 24h pour toute demande par email
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* FAQ rapide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="alpine-card">
          <CardHeader>
            <h2 className="text-2xl font-bold font-display flex items-center gap-2"><FaQuestionCircle className="text-info" /> Questions fréquentes</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FaReceipt className="text-success" /> Que comprend la location ?
                  </h4>
                  <p className="text-xs text-default-600">
                    Linge de lit, serviettes, peignoirs jacuzzi, WiFi,
                    bois/pellets (hiver)
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FaBroom className="text-warning" /> Le ménage est-il inclus ?
                  </h4>
                  <p className="text-xs text-default-600">
                    Forfait ménage obligatoire (100-150€ selon le chalet)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FaCar className="text-primary" /> Y a-t-il un parking ?
                  </h4>
                  <p className="text-xs text-default-600">
                    Parking privé gratuit disponible pour tous les chalets
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2"><FaSmokingBan className="text-danger" /> Peut-on fumer ?</h4>
                  <p className="text-xs text-default-600">
                    Tous nos chalets sont non-fumeur (extérieur autorisé)
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
