"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Input, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BsArrowLeft, BsFileText, BsCheck, BsPlus, BsX } from "react-icons/bs";
import Link from "next/link";

import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, Page, UpdatePageDto } from "@/types";
import YooptaEditorWrapper from "@/components/admin/YooptaEditor";

export default function EditPagePage() {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState<UpdatePageDto>({
    title: "",
    content: "",
    slug: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chaletId = params.chaletId as string;
        const pageSlug = params.pageSlug as string;

        const [chaletData, pagesData] = await Promise.all([
          chaletService.getById(chaletId),
          pageService.getByChaletId(chaletId),
        ]);

        const pageData = pagesData.find((p) => p.slug === pageSlug);

        if (!pageData) {
          setError("Page introuvable");

          return;
        }

        setChalet(chaletData);
        setPage(pageData);
        setFormData({
          title: pageData.title,
          content: pageData.content,
          slug: pageData.slug,
          tags: pageData.tags || [],
        });
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [params.chaletId, params.pageSlug]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    setLoading(true);
    setError(null);

    try {
      await pageService.update(page._id, formData);
      router.push(`/admin/chalets/${params.chaletId}`);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour:", err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !chalet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <Link href="/admin/chalets">
            <Button variant="outline">Retour aux chalets</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
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
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BsFileText className="h-6 w-6" />
              Modifier la page
            </h1>
            <p className="text-muted-foreground">
              {chalet?.name} • {page?.title}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold">Informations de la page</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Title and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  isRequired
                  label="Titre"
                  placeholder="Entrez le titre de la page"
                  value={formData.title}
                  variant="bordered"
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                <Input
                  isRequired
                  label="Slug"
                  placeholder="url-de-la-page"
                  value={formData.slug}
                  variant="bordered"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    className="flex-1"
                    label="Tags"
                    placeholder="Ajouter un tag"
                    value={tagInput}
                    variant="bordered"
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
                        endContent={
                          <button
                            className="ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <BsX className="h-3 w-3" />
                          </button>
                        }
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
                  className="min-h-[500px]"
                  placeholder="Modifiez le contenu de votre page..."
                  value={formData.content}
                  onChange={handleContentChange}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <Link href={`/admin/chalets/${params.chaletId}`}>
                  <Button variant="ghost">Annuler</Button>
                </Link>
                <Button
                  color="primary"
                  isLoading={loading}
                  startContent={!loading && <BsCheck className="h-4 w-4" />}
                  type="submit"
                >
                  {loading ? "Mise à jour..." : "Sauvegarder"}
                </Button>
              </div>
            </form>

            {error && (
              <div className="p-4 rounded-lg bg-danger/20 border border-danger/30">
                <p className="text-danger text-sm">{error}</p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
