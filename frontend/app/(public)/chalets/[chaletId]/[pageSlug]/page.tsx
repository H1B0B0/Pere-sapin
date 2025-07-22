"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { BsArrowLeft, BsTree, BsQrCode, BsEye } from "react-icons/bs";
import Link from "next/link";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { usePageViews } from "@/lib/hooks/usePageViews";
import { Chalet, Page } from "@/types";

// Simple markdown parser for basic formatting
const parseMarkdown = (markdown: string) => {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mb-3 text-foreground">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-4 text-foreground">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-6 text-foreground">$1</h1>');
  
  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  
  // Lists
  html = html.replace(/^\d+\.\s+(.*$)/gm, '<li class="mb-1">$1</li>');
  html = html.replace(/^-\s+(.*$)/gm, '<li class="mb-1">$1</li>');
  html = html.replace(/(<li.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4 space-y-1 text-foreground">$1</ul>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-4 text-foreground leading-relaxed">');
  html = `<p class="mb-4 text-foreground leading-relaxed">${html}</p>`;
  
  // Clean up empty paragraphs
  html = html.replace(/<p class="[^"]*">\s*<\/p>/g, '');
  
  return html;
};

export default function PublicPageView() {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  // Hook pour incrémenter les vues
  usePageViews(page?._id || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chaletId = params.chaletId as string;
        const pageSlug = params.pageSlug as string;
        
        const [chaletData, pagesData] = await Promise.all([
          chaletService.getById(chaletId),
          pageService.getByChaletId(chaletId),
        ]);

        const pageData = pagesData.find(p => p.slug === pageSlug && p.isActive !== false);
        
        if (!pageData) {
          notFound();
          return;
        }

        setChalet(chaletData);
        setPage(pageData);
      } catch (err) {
        console.error("Erreur lors du chargement:", err);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.chaletId, params.pageSlug]);

  const getTagColor = (tag: string) => {
    const colors = ["primary", "success", "warning", "secondary", "default"];
    const hash = tag.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!chalet || !page) {
    return null; // Will trigger notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête mobile-optimized */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <BsTree className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">{chalet.name}</h2>
              <p className="text-sm text-muted-foreground truncate">{page.title}</p>
            </div>
            <Button
              variant="light"
              size="sm"
              startContent={<BsQrCode className="h-4 w-4" />}
              className="shrink-0"
            >
              QR
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="alpine-card">
            <CardBody className="p-6 md:p-8">
              {/* Titre et tags */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-display gradient-festive bg-clip-text text-transparent mb-4">
                  {page.title}
                </h1>
                
                {page.tags && page.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {page.tags.map((tag) => (
                      <Chip
                        key={tag}
                        color={getTagColor(tag) as any}
                        variant="flat"
                        size="sm"
                      >
                        {tag}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>

              {/* Contenu markdown */}
              <div className="prose prose-lg max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: parseMarkdown(page.content) 
                  }}
                  className="markdown-content"
                />
              </div>

              {/* Footer de la page */}
              <div className="mt-12 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BsTree className="h-4 w-4" />
                    <span>{chalet.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Père Sapin
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Navigation vers d'autres pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card className="alpine-card">
            <CardBody className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Besoin d'aide avec autre chose ?
                </p>
                <p className="text-xs text-muted-foreground">
                  Scannez un autre QR code ou contactez-nous si vous avez des questions.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <style jsx>{`
        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .markdown-content h1:first-child,
        .markdown-content h2:first-child,
        .markdown-content h3:first-child {
          margin-top: 0;
        }
        
        .markdown-content ul {
          padding-left: 1.5rem;
        }
        
        .markdown-content li {
          list-style-type: disc;
        }
        
        .markdown-content strong {
          color: hsl(var(--foreground));
        }
        
        .markdown-content em {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}