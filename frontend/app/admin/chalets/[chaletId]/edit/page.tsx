"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { BsArrowLeft, BsTree, BsCheck } from "react-icons/bs";
import Link from "next/link";

import { getChaletById } from "@/lib/services/chalets";
import { updateChaletAction } from "@/lib/actions/chalets";
import { Chalet, UpdateChaletDto } from "@/types";

export default function EditChaletPage() {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [activeTab, setActiveTab] = useState<
    "basic" | "details" | "pricing" | "images" | "contact"
  >("basic");
  const [formData, setFormData] = useState<UpdateChaletDto>({
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
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAmenity, setNewAmenity] = useState("");
  const [newImage, setNewImage] = useState("");
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchChalet = async () => {
      try {
        const chaletId = params.chaletId as string;
        const chaletData = await getChaletById(chaletId);

        console.groupCollapsed("[ChaletEdit] Fetch", chaletId);
        console.log("Raw chaletData", chaletData);
        console.log("Keys", Object.keys(chaletData || {}));
        [
          "amenities",
          "features",
          "highlights",
          "prices",
          "images",
          "mainImage",
        ].forEach((k) => {
          if (!(k in (chaletData as any)))
            console.warn("[ChaletEdit] Champ manquant API:", k);
        });
        console.groupEnd();
        const anyData: any = chaletData;
        const amenities =
          chaletData.amenities ||
          anyData.equipements ||
          anyData.equipment ||
          [];
        const features = chaletData.features || anyData.caracteristiques || [];
        const highlights = chaletData.highlights || anyData.pointsForts || [];
        const prices = chaletData.prices ||
          anyData.tarifs || {
            weekend: "",
            week: "",
            holidays: "",
            cleaning: "",
          };

        console.log("[ChaletEdit] Fallback mapping");
        console.log("amenities:", amenities);
        console.log("features:", features);
        console.log("highlights:", highlights);
        console.log("prices:", prices);
        console.groupEnd();

        setChalet(chaletData);
        const initialForm = {
          name: chaletData.name,
          description: chaletData.description || "",
          location: chaletData.location || "",
          address: chaletData.address || "",
          capacity: chaletData.capacity,
          pricePerNight: chaletData.pricePerNight,
          rooms: chaletData.rooms || "",
          bedrooms: chaletData.bedrooms || "",
          bathrooms: chaletData.bathrooms || "",
          prices,
          amenities: Array.isArray(amenities) ? amenities : [],
          features: Array.isArray(features) ? features : [],
          highlights: Array.isArray(highlights) ? highlights : [],
          images: chaletData.images || [],
          mainImage: chaletData.mainImage || "",
          contactEmail: chaletData.contactEmail || "",
          contactPhone: chaletData.contactPhone || "",
          isActive: chaletData.isActive,
          color: chaletData.color || "",
          icon: chaletData.icon || "",
        };

        console.debug("[ChaletEdit] Initial formData", initialForm);
        setFormData(initialForm);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Chalet introuvable");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchChalet();
  }, [params.chaletId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setError("Le nom du chalet est requis");

      return;
    }

    if (!chalet) return;

    setLoading(true);
    setError(null);

    try {
      await updateChaletAction(chalet._id, formData);
      // La redirection est gérée dans l'action
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la modification du chalet",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof UpdateChaletDto,
    value: string | number | boolean | string[] | undefined,
  ) => {
    console.debug("[ChaletEdit] handleChange", field, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities?.includes(newAmenity.trim())) {
      console.debug("[ChaletEdit] addAmenity", newAmenity.trim());
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()],
      }));
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    console.debug("[ChaletEdit] removeAmenity", amenity);
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities?.filter((a) => a !== amenity) || [],
    }));
  };

  const addImage = () => {
    if (newImage.trim()) {
      console.debug("[ChaletEdit] addImage", newImage.trim());
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const removeImage = (img: string) => {
    console.debug("[ChaletEdit] removeImage", img);
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((i) => i !== img) || [],
      mainImage: prev.mainImage === img ? "" : prev.mainImage,
    }));
  };

  // Log snapshot formData après chaque update (hors phase de fetch initial)
  useEffect(() => {
    if (!fetchLoading) {
      console.debug("[ChaletEdit] formData snapshot", formData);
      if (formData.amenities && formData.amenities.length === 0) {
        console.warn("[ChaletEdit] amenities vide");
      }
    }
  }, [formData, fetchLoading]);

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du chalet...</p>
        </div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Chalet introuvable
        </h2>
        <p className="text-muted-foreground mb-6">
          Le chalet demandé n'existe pas ou a été supprimé.
        </p>
        <Link href="/admin/chalets">
          <Button color="primary">Retour aux chalets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/chalets/${chalet._id}`}>
            <Button
              startContent={<BsArrowLeft className="h-4 w-4" />}
              variant="light"
            >
              Retour au chalet
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary/20">
            <BsTree className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
              Modifier {chalet.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Modifiez les informations de ce chalet
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
              {/* Tabs custom */}
              <div className="w-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { k: "basic", label: "Informations de base" },
                    { k: "details", label: "Détails" },
                    { k: "pricing", label: "Tarifs détaillés" },
                    { k: "images", label: "Images" },
                    { k: "contact", label: "Contact" },
                  ].map((t) => (
                    <Button
                      key={t.k}
                      color={activeTab === t.k ? "primary" : "default"}
                      size="sm"
                      variant={activeTab === t.k ? "solid" : "flat"}
                      onPress={() => setActiveTab(t.k as any)}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
                {activeTab === "basic" && (
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
                        value={formData.name || ""}
                        variant="bordered"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
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
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleChange("address", e.target.value)
                      }
                    />
                  </div>
                )}
                {activeTab === "images" && (
                  <div className="space-y-6 py-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Image principale (URL)
                      </label>
                      <Input
                        placeholder="https://.../main.jpg"
                        value={formData.mainImage || ""}
                        variant="bordered"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("mainImage", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Galerie
                      </label>
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="URL d'image"
                          value={newImage}
                          variant="bordered"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setNewImage(e.target.value)
                          }
                          onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addImage())
                          }
                        />
                        <Button
                          color="primary"
                          variant="flat"
                          onPress={addImage}
                        >
                          Ajouter
                        </Button>
                      </div>
                      {formData.images && formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {formData.images.map((img) => (
                            <div
                              key={img}
                              className="relative group border border-border/30 rounded-md p-1 flex flex-col gap-1"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                alt="chalet"
                                className="w-full h-24 object-cover rounded"
                                src={img}
                              />
                              <div className="flex justify-between items-center text-[10px] px-1 pb-1">
                                <button
                                  className={`px-1 py-0.5 rounded bg-primary/20 hover:bg-primary/30 ${formData.mainImage === img ? "ring-1 ring-primary text-primary font-semibold" : "text-foreground/70"}`}
                                  type="button"
                                  onClick={() => handleChange("mainImage", img)}
                                >
                                  {formData.mainImage === img
                                    ? "Principale"
                                    : "Choisir"}
                                </button>
                                <button
                                  className="px-1 py-0.5 rounded bg-danger/20 hover:bg-danger/30 text-danger"
                                  type="button"
                                  onClick={() => removeImage(img)}
                                >
                                  Suppr
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "details" && (
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange(
                            "capacity",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange(
                            "pricePerNight",
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("bathrooms", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Équipements et services
                      </label>
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Ajouter un équipement"
                          value={newAmenity}
                          variant="bordered"
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setNewAmenity(e.target.value)
                          }
                          onKeyPress={(e: KeyboardEvent<HTMLInputElement>) =>
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
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Caractéristiques (features)
                      </label>
                      <Textarea
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        placeholder="Une par ligne"
                        rows={3}
                        value={(formData.features || []).join("\n")}
                        variant="bordered"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          handleChange(
                            "features",
                            e.target.value.split(/\n+/).filter(Boolean),
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Points forts (highlights)
                      </label>
                      <Textarea
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        placeholder="Une par ligne"
                        rows={3}
                        value={(formData.highlights || []).join("\n")}
                        variant="bordered"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          handleChange(
                            "highlights",
                            e.target.value.split(/\n+/).filter(Boolean),
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
                        label="Couleur (slug tailwind / token)"
                        placeholder="ex: primary, success"
                        value={formData.color || ""}
                        variant="bordered"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("color", e.target.value)
                        }
                      />
                      <Input
                        classNames={{
                          input: "bg-transparent",
                          inputWrapper:
                            "border-border/50 hover:border-border focus-within:!border-primary",
                        }}
                        label="Icône (identifiant)"
                        placeholder="ex: pine-tree"
                        value={formData.icon || ""}
                        variant="bordered"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("icon", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Week-end"
                        placeholder="ex: 800-900€"
                        value={formData.prices?.weekend || ""}
                        variant="bordered"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                )}

                {activeTab === "contact" && (
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleChange("contactPhone", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <label className="text-sm font-medium">Actif</label>
                      <Button
                        color={formData.isActive ? "success" : "default"}
                        size="sm"
                        variant={formData.isActive ? "solid" : "flat"}
                        onPress={() =>
                          handleChange("isActive", !formData.isActive)
                        }
                      >
                        {formData.isActive ? "Oui" : "Non"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-danger/20 border border-danger/30 mt-6">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <Link className="flex-1" href={`/admin/chalets/${chalet._id}`}>
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
                  {loading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
