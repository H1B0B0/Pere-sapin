"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Chip } from "@heroui/react";
import { BsArrowLeft, BsCheck, BsPlus } from "react-icons/bs";
import Link from "next/link";

import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, CreatePageDto } from "@/types";
import YooptaEditorWrapper from "@/components/admin/YooptaEditor";

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
        setFormData((prev) => ({ ...prev, chalet: chaletId }));
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
      .replace(/[àáäâ]/g, "a")
      .replace(/[èéëê]/g, "e")
      .replace(/[ìíïî]/g, "i")
      .replace(/[òóöô]/g, "o")
      .replace(/[ùúüû]/g, "u")
      .replace(/[ç]/g, "c")
      .replace(/[^a-z0-9\\s-]/g, "")
      .replace(/\\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();

    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleContentChange = (markdown: string) => {
    setFormData((prev) => ({ ...prev, content: markdown }));
    console.log("Contenu mis à jour:", markdown);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const pageData: CreatePageDto = {
        ...formData,
        content: formData.content,
      };

      await pageService.create(pageData);
      router.push(`/admin/chalets/${params.chaletId}`);
    } catch (err: any) {
      console.error("Erreur lors de la création:", err);
      setError(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-danger mb-4">Chalet introuvable</p>
            <Link href="/admin/chalets">
              <Button variant="outline">Retour aux chalets</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href={`/admin/chalets/${params.chaletId}`}>
            <Button isIconOnly size="sm" variant="ghost">
              <BsArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Nouvelle page</h1>
            <p className="text-muted-foreground">Chalet: {chalet.name}</p>
          </div>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            isRequired
            label="Titre"
            placeholder="Entrez le titre de la page"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <Input
            isRequired
            label="Slug"
            placeholder="url-de-la-page"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              label="Tags"
              placeholder="Ajouter un tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button
              isIconOnly
              disabled={!tagInput.trim()}
              type="button"
              variant="flat"
              onClick={addTag}
            >
              <BsPlus className="h-4 w-4" />
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  color="primary"
                  size="sm"
                  variant="flat"
                  onClose={() => removeTag(tag)}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Contenu</label>
          <YooptaEditorWrapper
            placeholder="Commencez à écrire votre contenu..."
            value={formData.content}
            onChange={handleContentChange}
          />
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <Link href={`/admin/chalets/${params.chaletId}`}>
            <Button variant="ghost">Annuler</Button>
          </Link>
          <Button
            color="primary"
            isLoading={loading}
            startContent={!loading && <BsCheck className="h-4 w-4" />}
            type="submit"
          >
            {loading ? "Création..." : "Créer la page"}
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-danger/20 border border-danger/30">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
