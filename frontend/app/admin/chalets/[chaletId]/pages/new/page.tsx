"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Chip, Link } from "@heroui/react";
import { BsArrowLeft, BsCheck, BsPlus } from "react-icons/bs";
import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import YooptaLink from "@yoopta/link";
import Callout from "@yoopta/callout";
import Video from "@yoopta/video";
import File from "@yoopta/file";
import Accordion from "@yoopta/accordion";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";
import { HeadingOne, HeadingThree, HeadingTwo } from "@yoopta/headings";
import Code from "@yoopta/code";
import Table from "@yoopta/table";
import Divider from "@yoopta/divider";
import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Divider as HeroDivider } from "@heroui/react";

import { WITH_BASIC_INIT_VALUE } from "./initValue";

import { getChaletByIdClient } from "@/lib/services/client-chalets";
import { createPageClient } from "@/lib/services/client-pages";
import { Chalet, CreatePageDto } from "@/types";

const plugins = [
  Paragraph,
  Table,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: "#007aff",
      }),
    },
  }),
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  YooptaLink,
  Embed,
  Image.extend({
    options: {
      async onUpload(file) {
        // Pour le moment, on convertit en base64 pour éviter de devoir créer la page d'abord
        return new Promise((resolve) => {
          const reader = new FileReader();

          reader.onload = () => {
            resolve({
              src: reader.result as string,
              alt: file.name,
              sizes: {
                width: 800, // Valeur par défaut
                height: 600, // Valeur par défaut
              },
            });
          };
          reader.readAsDataURL(file);
        });
      },
    },
  }),
  Video.extend({
    options: {
      // onUpload: async (file) => {
      //   const data = await uploadToCloudinary(file, "video");
      //   return {
      //     src: data.secure_url,
      //     alt: "cloudinary",
      //     sizes: {
      //       width: data.width,
      //       height: data.height,
      //     },
      //   };
      // },
      // onUploadPoster: async (file) => {
      //   const image = await uploadToCloudinary(file, "image");
      //   return image.secure_url;
      // },
    },
  }),
  File.extend({
    options: {
      // onUpload: async (file) => {
      //   const response = await uploadToCloudinary(file, "auto");
      //   return {
      //     src: response.secure_url,
      //     format: response.format,
      //     name: response.name,
      //     size: response.bytes,
      //   };
      // },
    },
  }),
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

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

  const [value, setValue] = useState(WITH_BASIC_INIT_VALUE);
  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const onChange = (
    newValue: YooptaContentValue,
    options: YooptaOnChangeOptions,
  ) => {
    setValue(newValue);
    // Serialize the content for the form
    const serializedContent = JSON.stringify(newValue);

    setFormData((prev) => ({ ...prev, content: serializedContent }));
  };

  // Initialize content when editor is ready
  useEffect(() => {
    if (editor) {
      setValue(WITH_BASIC_INIT_VALUE);
      // Initialize form content with initial value
      const serializedContent = JSON.stringify(WITH_BASIC_INIT_VALUE);

      setFormData((prev) => ({ ...prev, content: serializedContent }));
    }
  }, [editor]);

  useEffect(() => {
    const fetchChalet = async () => {
      try {
        const chaletId = params.chaletId as string;
        const chaletData = await getChaletByIdClient(chaletId);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const pageData: CreatePageDto = {
        ...formData,
        content: formData.content,
      };

      const newPage = await createPageClient(pageData);

      console.log("Page créée avec succès:", newPage);
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
      <Card>
        <div className="container mx-auto py-6 px-4 max-w-5xl">
          <CardHeader>
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
          </CardHeader>
          <HeroDivider />
          <CardBody>
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Title and Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  isRequired
                  label="Titre"
                  placeholder="Entrez le titre de la page"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTitleChange(e.target.value)}
                />
                <Input
                  isRequired
                  label="Slug"
                  placeholder="url-de-la-page"
                  value={formData.slug}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                />
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    label="Tags"
                    placeholder="Ajouter un tag"
                    value={tagInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
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
              <HeroDivider />

              {/* Content Editor */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Contenu de la page
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Utilisez l'éditeur ci-dessous pour créer le contenu de votre
                    page.
                  </p>
                </div>
                <div ref={selectionRef}>
                  <YooptaEditor
                    autoFocus
                    editor={editor}
                    marks={MARKS}
                    plugins={plugins as any}
                    selectionBoxRoot={selectionRef}
                    tools={TOOLS}
                    value={value}
                    onChange={onChange}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border/20">
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
          </CardBody>
        </div>
      </Card>
    </div>
  );
}
