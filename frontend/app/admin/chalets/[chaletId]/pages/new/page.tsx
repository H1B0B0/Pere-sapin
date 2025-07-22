"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Input, Textarea, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BsArrowLeft, BsFileText, BsCheck, BsPlus, BsX } from "react-icons/bs";
import Link from "next/link";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, CreatePageDto } from "@/types";

export default function NewPagePage() {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [formData, setFormData] = useState<CreatePageDto>({
    title: "",
    content: "",
    slug: "",
    tags: [],
    chalet: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchChalet = async () => {
      try {
        const chaletId = params.chaletId as string;
        const chaletData = await chaletService.getById(chaletId);
        setChalet(chaletData);
        setFormData(prev => ({ ...prev, chalet: chaletId }));
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Chalet introuvable");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchChalet();
  }, [params.chaletId]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáäâ]/g, 'a')
      .replace(/[èéëê]/g, 'e')
      .replace(/[ìíïî]/g, 'i')
      .replace(/[òóöô]/g, 'o')
      .replace(/[ùúüû]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError("Le titre de la page est requis");
      return;
    }

    if (!formData.content.trim()) {
      setError("Le contenu de la page est requis");
      return;
    }

    if (!chalet) return;

    setLoading(true);
    setError(null);

    try {
      const newPage = await pageService.create(formData);
      router.push(`/admin/chalets/${chalet._id}`);
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      setError("Erreur lors de la création de la page");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreatePageDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Chalet introuvable</h2>
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href={`/admin/chalets/${chalet._id}`}>
            <Button
              variant="light"
              startContent={<BsArrowLeft className="h-4 w-4" />}
            >
              Retour au chalet
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-success/20">
            <BsFileText className="h-8 w-8 text-success" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display gradient-festive bg-clip-text text-transparent">
              Nouvelle Page
            </h1>
            <p className="text-muted-foreground mt-1">
              Créez une nouvelle page explicative pour {chalet.name}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Formulaire */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="alpine-card">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Informations de la page
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Titre de la page"
                  placeholder="ex: Guide d'utilisation du jacuzzi"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  isRequired
                  variant="bordered"
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: "border-border/50 hover:border-border focus-within:!border-primary",
                  }}
                />

                <Input
                  label="Slug (URL)"
                  placeholder="guide-jacuzzi"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  isRequired
                  variant="bordered"
                  classNames={{
                    input: "bg-transparent",
                    inputWrapper: "border-border/50 hover:border-border focus-within:!border-primary",
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Ajouter un tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    variant="bordered"
                    classNames={{
                      input: "bg-transparent",
                      inputWrapper: "border-border/50 hover:border-border focus-within:!border-primary",
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="flat"
                    color="primary"
                    isIconOnly
                  >
                    <BsPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <Chip
                      key={tag}
                      onClose={() => removeTag(tag)}
                      variant="flat"
                      color="primary"
                      endContent={<BsX className="h-3 w-3" />}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>

              <Textarea
                label="Contenu (Markdown)"
                placeholder={`# Guide d'utilisation

## Étapes à suivre

1. Première étape...
2. Deuxième étape...

## Conseils de sécurité

- Important : ...
- Attention : ...`}
                value={formData.content}
                onChange={(e) => handleChange("content", e.target.value)}
                isRequired
                variant="bordered"
                rows={12}
                classNames={{
                  input: "bg-transparent font-mono text-sm",
                  inputWrapper: "border-border/50 hover:border-border focus-within:!border-primary",
                }}
              />

              {error && (
                <div className="p-4 rounded-lg bg-danger/20 border border-danger/30">
                  <p className="text-danger text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Link href={`/admin/chalets/${chalet._id}`} className="flex-1">
                  <Button
                    variant="flat"
                    color="default"
                    className="w-full"
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                </Link>
                <Button
                  type="submit"
                  color="primary"
                  className="flex-1 btn-alpine text-primary-foreground"
                  isLoading={loading}
                  startContent={!loading && <BsCheck className="h-4 w-4" />}
                >
                  {loading ? "Création..." : "Créer la page"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}