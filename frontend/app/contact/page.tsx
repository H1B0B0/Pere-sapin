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
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-red-600 dark:from-green-400 dark:to-red-400 bg-clip-text text-transparent">
          📞 Contactez-nous
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
          <Card className="shadow-lg">
            <CardHeader>
              <h2 className="text-2xl font-bold">
                ✉️ Demande de renseignements
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
                className="w-full font-semibold"
              >
                📧 Envoyer ma demande
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
          <Card className="shadow-md">
            <CardHeader>
              <h3 className="text-xl font-bold">📱 Contact direct</h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="font-semibold">M. STEPHAN</p>
                    <p className="text-sm text-default-600">Propriétaire</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold">
                      contact@chaletduperesapin.fr
                    </p>
                    <p className="text-sm text-default-600">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="font-semibold">06 XX XX XX XX</p>
                    <p className="text-sm text-default-600">7j/7 - 9h-20h</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Chip color="warning" variant="flat" size="sm">
                  ⚠️ Attention : Évitez les commissions LeBonCoin
                </Chip>
                <p className="text-xs text-default-500 mt-2">
                  Contactez-nous directement pour éviter les frais
                  supplémentaires
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Localisation */}
          <Card className="shadow-md">
            <CardHeader>
              <h3 className="text-xl font-bold">📍 Localisation</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏔️</span>
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
                  className="w-full"
                >
                  🗺️ Voir sur la carte
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Horaires */}
          <Card className="shadow-md">
            <CardHeader>
              <h3 className="text-xl font-bold">🕒 Disponibilité</h3>
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
                <p className="text-xs text-center">
                  💬 Réponse garantie sous 24h pour toute demande par email
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
        <Card className="border-none">
          <CardHeader>
            <h2 className="text-2xl font-bold">❓ Questions fréquentes</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">
                    🧾 Que comprend la location ?
                  </h4>
                  <p className="text-xs text-default-600">
                    Linge de lit, serviettes, peignoirs jacuzzi, WiFi,
                    bois/pellets (hiver)
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm">
                    🧹 Le ménage est-il inclus ?
                  </h4>
                  <p className="text-xs text-default-600">
                    Forfait ménage obligatoire (100-150€ selon le chalet)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm">
                    🚗 Y a-t-il un parking ?
                  </h4>
                  <p className="text-xs text-default-600">
                    Parking privé gratuit disponible pour tous les chalets
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm">🚭 Peut-on fumer ?</h4>
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
