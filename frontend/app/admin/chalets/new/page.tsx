"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Chip,
  Tabs,
  Tab,
} from "@heroui/react";
import { motion } from "framer-motion";
import { BsArrowLeft, BsTree, BsCheck } from "react-icons/bs";
import Link from "next/link";

import { createChaletAction } from "@/lib/actions/chalets";
import { CreateChaletDto } from "@/types";

export default function NewChaletPage() {
  const [formData, setFormData] = useState<CreateChaletDto>({
    name: "",
    description: "",
    location: "",
    address: "",
    capacity: undefined,
    pricePerNight: undefined,
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    prices: { weekend: "", week: "", holidays: "", cleaning: "" },
    amenities: [],
    features: [],
    highlights: [],
    images: [],
    mainImage: "",
    contactEmail: "",
    contactPhone: "",
    isActive: true,
    color: "",
    icon: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newAmenity, setNewAmenity] = useState("");
  // const router = useRouter(); // Will be used for navigation after creation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Le nom du chalet est requis");

      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createChaletAction(formData);
      // La redirection est gérée dans l'action
    } catch (err) {
      // console.error("Erreur lors de la création:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du chalet"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof CreateChaletDto,
    value: string | number | boolean | string[] | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities?.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities?.filter((a) => a !== amenity) || [],
    }));
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/chalets">
            <Button
              startContent={<BsArrowLeft className="h-4 w-4" />}
              variant="light"
            >
              Retour aux chalets
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary/20">
            <BsTree className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
              Nouveau Chalet
            </h1>
            <p className="text-muted-foreground mt-1">
              Créez un nouveau chalet pour votre location
            </p>
          </div>
        </div>
      </motion.div>

      {/* Formulaire */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Informations du chalet
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              {/* @ts-expect-error HeroUI Tabs component type issue */}
              <Tabs aria-label="Sections du formulaire" className="w-full">
                <Tab key="basic" title="Informations de base">
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        isRequired
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Nom du chalet"
                        placeholder="ex: Chalet des Sapins"
                        value={formData.name}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("name", e.target.value)
                        }
                      />

                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Lieu"
                        placeholder="ex: Chamonix, France"
                        value={formData.location || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("location", e.target.value)
                        }
                      />
                    </div>

                    <Textarea
                      classNames={{
                        input: "bg-transparent",
                        inputWrapper:
                          "border-border/50 hover:border-border focus-within:!border-primary",
                      }}
                      label="Description"
                      placeholder="Décrivez votre chalet, ses équipements, sa situation..."
                      rows={4}
                      value={formData.description || ""}
                      variant="bordered"
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleChange("description", e.target.value)
                      }
                    />

                    <Textarea
                      classNames={{
                        input: "bg-transparent",
                        inputWrapper:
                          "border-border/50 hover:border-border focus-within:!border-primary",
                      }}
                      label="Adresse complète"
                      placeholder="Adresse complète du chalet"
                      rows={2}
                      value={formData.address || ""}
                      variant="bordered"
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleChange("address", e.target.value)
                      }
                    />
                  </div>
                </Tab>

                <Tab key="details" title="Détails">
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Capacité (personnes)"
                        placeholder="ex: 6"
                        type="number"
                        value={formData.capacity?.toString() || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(
                            "capacity",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />

                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Prix par nuit (€)"
                        placeholder="ex: 150"
                        type="number"
                        value={formData.pricePerNight?.toString() || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(
                            "pricePerNight",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Pièces (résumé)"
                        placeholder="ex: 5 chambres"
                        value={formData.rooms || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("rooms", e.target.value)
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Chambres (détails)"
                        placeholder="Description lits/chambres"
                        value={formData.bedrooms || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("bedrooms", e.target.value)
                        }
                      />
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Salles de bain / WC"
                        placeholder="Détails salles de bain"
                        value={formData.bathrooms || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("bathrooms", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label
                        className="text-sm font-medium text-foreground mb-2 block"
                        htmlFor="amenities-input"
                      >
                        Équipements et services
                      </label>
                      <div className="flex gap-2 mb-3">
                        <Input
                          id="amenities-input"
                          placeholder="Ajouter un équipement"
                          value={newAmenity}
                          variant="bordered"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setNewAmenity(e.target.value)
                          }
                          onKeyPress={(
                            e: React.KeyboardEvent<HTMLInputElement>
                          ) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addAmenity())
                          }
                        />
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={addAmenity}
                        >
                          Ajouter
                        </Button>
                      </div>
                      {formData.amenities && formData.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.map((amenity) => (
                            <Chip
                              key={amenity}
                              color="primary"
                              variant="flat"
                              onClose={() => removeAmenity(amenity)}
                            >
                              {amenity}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        className="text-sm font-medium text-foreground mb-2 block"
                        htmlFor="features-textarea"
                      >
                        Caractéristiques (features)
                      </label>
                      <Textarea
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        id="features-textarea"
                        placeholder="Une par ligne"
                        rows={3}
                        value={(formData.features || []).join("\n")}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleChange(
                            "features",
                            e.target.value.split(/\n+/).filter(Boolean)
                          )
                        }
                      />
                    </div>

                    <div>
                      <label
                        className="text-sm font-medium text-foreground mb-2 block"
                        htmlFor="highlights-textarea"
                      >
                        Points forts (highlights)
                      </label>
                      <Textarea
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        id="highlights-textarea"
                        placeholder="Une par ligne"
                        rows={3}
                        value={(formData.highlights || []).join("\n")}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          handleChange(
                            "highlights",
                            e.target.value.split(/\n+/).filter(Boolean)
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Couleur (slug/theme)"
                        placeholder="ex: primary"
                        value={formData.color || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("color", e.target.value)
                        }
                      />
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Icône"
                        placeholder="ex: pine-tree"
                        value={formData.icon || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("icon", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </Tab>

                <Tab key="pricing" title="Tarifs détaillés">
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Week-end"
                        placeholder="ex: 800-900€"
                        value={formData.prices?.weekend || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            prices: { ...prev.prices, weekend: e.target.value },
                          }))
                        }
                      />
                      <Input
                        label="Semaine"
                        placeholder="ex: 1100-1900€"
                        value={formData.prices?.week || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            prices: { ...prev.prices, week: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Vacances"
                        placeholder="ex: 2200€"
                        value={formData.prices?.holidays || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            prices: {
                              ...prev.prices,
                              holidays: e.target.value,
                            },
                          }))
                        }
                      />
                      <Input
                        label="Ménage"
                        placeholder="ex: 100€"
                        value={formData.prices?.cleaning || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev) => ({
                            ...prev,
                            prices: {
                              ...prev.prices,
                              cleaning: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </Tab>

                <Tab key="contact" title="Contact">
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Email de contact"
                        placeholder="contact@example.com"
                        type="email"
                        value={formData.contactEmail || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("contactEmail", e.target.value)
                        }
                      />

                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Téléphone de contact"
                        placeholder="+33 1 23 45 67 89"
                        type="tel"
                        value={formData.contactPhone || ""}
                        variant="bordered"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange("contactPhone", e.target.value)
                        }
                      />
                    </div>

                    <Input
                      classNames={{
                        input: "bg-transparent",
                        inputWrapper:
                          "border-border/50 hover:border-border focus-within:!border-primary",
                      }}
                      label="Image principale (URL)"
                      placeholder="https://example.com/image.jpg"
                      type="url"
                      value={formData.mainImage || ""}
                      variant="bordered"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange("mainImage", e.target.value)
                      }
                    />
                  </div>
                </Tab>
              </Tabs>

              {error && (
                <div className="p-4 rounded-lg bg-danger/20 border border-danger/30 mt-6">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <Link className="flex-1" href="/admin/chalets">
                  <Button
                    className="w-full"
                    color="default"
                    disabled={loading}
                    variant="flat"
                  >
                    Annuler
                  </Button>
                </Link>
                <Button
                  className="flex-1 btn-alpine text-primary-foreground"
                  color="primary"
                  isLoading={loading}
                  startContent={!loading && <BsCheck className="h-4 w-4" />}
                  type="submit"
                >
                  {loading ? "Création..." : "Créer le chalet"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
