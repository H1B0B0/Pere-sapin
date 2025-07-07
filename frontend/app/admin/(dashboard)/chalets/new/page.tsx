"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { chaletService } from "@/lib/services/chalets";
import { CreateChaletDto } from "@/types";
import Link from "next/link";
import { ArrowLeftIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";

export default function NewChaletPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateChaletDto>({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<CreateChaletDto>>({});

  const validateForm = () => {
    const newErrors: Partial<CreateChaletDto> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom du chalet est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const newChalet = await chaletService.create(formData);
      router.push(`/admin/chalets/${newChalet._id}`);
    } catch (error) {
      console.error("Error creating chalet:", error);
      // Handle error (you might want to show a toast or error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Nouveau Chalet</h1>
          <p className="text-muted-foreground">
            Créez un nouveau chalet pour organiser vos pages QR
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <BuildingOfficeIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <p className="text-md font-semibold">Informations du chalet</p>
            <p className="text-sm text-muted-foreground">
              Renseignez les détails de votre nouveau chalet
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du chalet</label>
              <Input
                placeholder="Ex: Chalet des Alpes"
                value={formData.name}
                onValueChange={(value: string) => {
                  setFormData({ ...formData, name: value });
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description (optionnel)
              </label>
              <Textarea
                placeholder="Décrivez votre chalet..."
                value={formData.description}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, description: value })
                }
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link href="/admin" className="flex-1">
                <Button variant="outline" className="w-full" disabled={loading}>
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                color="primary"
                className="flex-1"
                isLoading={loading}
                isDisabled={!formData.name.trim()}
              >
                Créer le chalet
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Help Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardBody>
          <div className="flex items-start gap-3">
            <BuildingOfficeIcon className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary mb-1">
                À propos des chalets
              </p>
              <p className="text-sm text-default-600">
                Un chalet vous permet d'organiser vos pages QR par thème ou
                lieu. Vous pourrez ensuite créer des pages avec du contenu
                spécifique et générer des QR codes pour chacune d'elles.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
