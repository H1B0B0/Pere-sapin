"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { motion } from "framer-motion";
import { BsArrowLeft, BsTree, BsCheck } from "react-icons/bs";
import Link from "next/link";

import { getChaletById, updateChalet } from "@/lib/services/chalets";
import { Chalet, CreateChaletDto } from "@/types";

type UpdateChaletDto = Partial<CreateChaletDto>;

export default function EditChaletPage() {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [formData, setFormData] = useState<UpdateChaletDto>({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchChalet = async () => {
      try {
        const chaletId = params.chaletId as string;
        const chaletData = await getChaletById(chaletId);

        setChalet(chaletData);
        setFormData({
          name: chaletData.name,
          description: chaletData.description || "",
        });
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
      await updateChalet(chalet._id, formData);
      router.push(`/admin/chalets/${chalet._id}`);
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setError("Erreur lors de la modification du chalet");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateChaletDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
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
                  onChange={(e) => handleChange("name", e.target.value)}
                />

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
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-danger/20 border border-danger/30">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
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
