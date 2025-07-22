"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button, Input, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import {
  BsArrowLeft,
  BsCheck,
  BsPlus,
  BsType,
  BsTextLeft,
  BsCode,
  BsListUl,
  BsListOl,
  BsQuote,
} from "react-icons/bs";
import Link from "next/link";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { Chalet, CreatePageDto } from "@/types";

// Fonction pour convertir HTML en Markdown
const htmlToMarkdown = (html: string): string => {
  let markdown = html;
  
  // Remplacer les éléments HTML par leur équivalent Markdown
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1');
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/g, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/g, '*$1*');
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/g, '`$1`');
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '> $1');
  
  // Listes
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gs, (match, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n');
  });
  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gs, (match, content) => {
    let counter = 1;
    return content.replace(/<li[^>]*>(.*?)<\/li>/g, () => `${counter++}. $1\n`);
  });
  
  // Liens
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');
  
  // Paragraphes
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n');
  markdown = markdown.replace(/<br[^>]*\/?>/g, '\n');
  markdown = markdown.replace(/<div[^>]*>(.*?)<\/div>/g, '$1\n');
  
  // Nettoyer les balises restantes
  markdown = markdown.replace(/<[^>]*>/g, '');
  
  // Nettoyer les espaces multiples et retours à la ligne
  markdown = markdown.replace(/\n{3,}/g, '\n\n');
  markdown = markdown.trim();
  
  return markdown;
};

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
  const editorRef = useRef<HTMLDivElement>(null);
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

  // Commandes de formatage WYSIWYG
  const formatText = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertHeading = (level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const element = range.startContainer.nodeType === Node.TEXT_NODE 
        ? range.startContainer.parentElement 
        : range.startContainer as Element;
      
      const heading = document.createElement(`h${level}`);
      heading.style.fontSize = level === 1 ? '2em' : level === 2 ? '1.5em' : '1.25em';
      heading.style.fontWeight = '600';
      heading.style.marginTop = level === 1 ? '32px' : level === 2 ? '28px' : '24px';
      heading.style.marginBottom = '4px';
      heading.style.color = 'rgba(255, 255, 255, 0.9)';
      heading.style.lineHeight = '1.2';
      
      if (element?.textContent) {
        heading.textContent = element.textContent;
        element.parentNode?.replaceChild(heading, element);
      } else {
        heading.innerHTML = '&nbsp;';
        range.insertNode(heading);
      }
      
      // Placer le curseur dans le heading
      const newRange = document.createRange();
      newRange.selectNodeContents(heading);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    editorRef.current?.focus();
  };

  const insertList = (ordered: boolean = false) => {
    const listType = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    document.execCommand(listType, false);
    editorRef.current?.focus();
  };

  const insertBlockquote = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const blockquote = document.createElement('blockquote');
      blockquote.style.borderLeft = '3px solid rgba(255, 255, 255, 0.2)';
      blockquote.style.paddingLeft = '14px';
      blockquote.style.margin = '4px 0';
      blockquote.style.color = 'rgba(255, 255, 255, 0.7)';
      blockquote.style.fontStyle = 'normal';
      blockquote.innerHTML = '&nbsp;';
      
      const range = selection.getRangeAt(0);
      range.insertNode(blockquote);
      
      // Placer le curseur dans la citation
      const newRange = document.createRange();
      newRange.selectNodeContents(blockquote);
      newRange.collapse(false);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      // La gestion se fait automatiquement grâce à contentEditable
      // Le contenu HTML sera converti en markdown au moment du save
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Le titre de la page est requis");
      return;
    }

    if (!editorRef.current?.innerHTML.trim() || editorRef.current.innerHTML === '<br>') {
      setError("Le contenu de la page est requis");
      return;
    }

    if (!chalet) return;

    setLoading(true);
    setError(null);

    try {
      // Convertir le contenu HTML en Markdown
      const htmlContent = editorRef.current.innerHTML;
      const markdownContent = htmlToMarkdown(htmlContent);
      
      const pageData = {
        ...formData,
        content: markdownContent
      };

      const newPage = await pageService.create(pageData);
      router.push(`/admin/chalets/${chalet._id}`);
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      setError("Erreur lors de la création de la page");
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Chalet introuvable
        </h2>
        <Link href="/admin/chalets">
          <Button color="primary">Retour aux chalets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-border/50 pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/admin/chalets/${chalet._id}`}>
              <Button
                variant="ghost"
                size="sm"
                startContent={<BsArrowLeft className="h-4 w-4" />}
                className="text-muted-foreground hover:text-foreground"
              >
                Retour
              </Button>
            </Link>
            <div className="h-6 w-px bg-border/50" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Nouvelle page
              </h1>
              <p className="text-sm text-muted-foreground">{chalet.name}</p>
            </div>
          </div>

          <Button
            color="primary"
            className="btn-alpine text-primary-foreground"
            isLoading={loading}
            onClick={handleSubmit}
            startContent={!loading && <BsCheck className="h-4 w-4" />}
          >
            {loading ? "Publication..." : "Publier"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        {/* Title */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Titre de la page..."
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground resize-none"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          />

          <div className="flex items-center space-x-4">
            <Input
              size="sm"
              placeholder="URL slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              variant="bordered"
              className="max-w-xs"
              classNames={{
                input: "text-sm",
                inputWrapper: "h-8 border-border/50 hover:border-border",
              }}
            />

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ajouter un tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground w-32"
              />
              <Button
                type="button"
                size="sm"
                isIconOnly
                variant="ghost"
                onClick={addTag}
                className="h-6 w-6 min-w-6"
              >
                <BsPlus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClose={() => removeTag(tag)}
                  classNames={{
                    content: "text-xs px-2",
                    closeButton: "text-xs",
                  }}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </div>

        {/* WYSIWYG Editor */}
        <div className="flex-1 border border-border/50 rounded-lg overflow-hidden">
          {/* Toolbar */}
          <div className="border-b border-border/50 p-3 bg-muted/10">
            <div className="flex items-center space-x-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => formatText("bold")}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Gras"
              >
                <BsType className="h-4 w-4 font-bold" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => formatText("italic")}
                className="h-8 w-8 text-muted-foreground hover:text-foreground italic"
                title="Italique"
              >
                <BsTextLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => {
                  const selection = window.getSelection();
                  if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const selectedText = range.toString();
                    const code = document.createElement('code');
                    code.style.background = 'rgba(135, 131, 120, 0.15)';
                    code.style.color = 'rgb(235, 87, 87)';
                    code.style.padding = '0.2em 0.4em';
                    code.style.borderRadius = '3px';
                    code.style.fontSize = '85%';
                    code.style.fontFamily = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace";
                    code.textContent = selectedText || 'code';
                    
                    range.deleteContents();
                    range.insertNode(code);
                    
                    // Place cursor after code
                    const newRange = document.createRange();
                    newRange.setStartAfter(code);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                  }
                  editorRef.current?.focus();
                }}
                className="h-8 w-8 text-muted-foreground hover:text-foreground font-mono"
                title="Code"
              >
                <BsCode className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border/50 mx-2" />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => insertHeading(1)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Titre H1"
              >
                H1
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => insertHeading(2)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Titre H2"
              >
                H2
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => insertHeading(3)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Titre H3"
              >
                H3
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => insertList(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Liste"
              >
                <BsListUl className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={() => insertList(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Liste numérotée"
              >
                <BsListOl className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                isIconOnly
                onClick={insertBlockquote}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Citation"
              >
                <BsQuote className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* WYSIWYG Content Editor - Notion Style */}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            className="min-h-[500px] p-6 outline-none text-base leading-relaxed"
            style={{
              fontFamily: '"ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"',
              backgroundColor: 'rgb(37, 37, 37)',
              color: 'rgba(255, 255, 255, 0.9)'
            }}
            data-placeholder="Tapez '/' pour les commandes ou commencez à écrire..."
          />
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-danger/20 border border-danger/30">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}
      </form>

      <style jsx>{`
        /* Notion dark theme styles */
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgba(255, 255, 255, 0.375);
        }
        
        [contenteditable] {
          line-height: 1.5;
          font-size: 16px;
        }
        
        [contenteditable] div:empty {
          min-height: 1em;
        }
        
        [contenteditable] h1, [contenteditable] h2, [contenteditable] h3 {
          font-weight: 600;
          margin: 2px 0 1px 0;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.2;
        }
        
        [contenteditable] h1 { 
          font-size: 2em; 
          margin-top: 32px;
          margin-bottom: 4px;
        }
        [contenteditable] h2 { 
          font-size: 1.5em; 
          margin-top: 28px;
          margin-bottom: 4px;
        }
        [contenteditable] h3 { 
          font-size: 1.25em; 
          margin-top: 24px;
          margin-bottom: 4px;
        }
        
        [contenteditable] p {
          margin: 3px 0;
          color: rgba(255, 255, 255, 0.9);
          min-height: 1em;
        }
        
        [contenteditable] strong {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }
        
        [contenteditable] em {
          font-style: italic;
          color: rgba(255, 255, 255, 0.9);
        }
        
        [contenteditable] code {
          background: rgba(135, 131, 120, 0.15);
          color: rgb(235, 87, 87);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 85%;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        }
        
        [contenteditable] pre {
          background: rgba(135, 131, 120, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          padding: 16px;
          margin: 8px 0;
          font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
          font-size: 14px;
          line-height: 1.45;
          overflow-x: auto;
        }
        
        [contenteditable] blockquote {
          border-left: 3px solid rgba(255, 255, 255, 0.2);
          padding-left: 14px;
          margin: 4px 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: normal;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 4px 0;
          padding-left: 24px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        [contenteditable] li {
          margin: 2px 0;
          color: rgba(255, 255, 255, 0.9);
        }
        
        [contenteditable] ul > li {
          list-style-type: disc;
        }
        
        [contenteditable] ol > li {
          list-style-type: decimal;
        }
        
        /* Focus state */
        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}