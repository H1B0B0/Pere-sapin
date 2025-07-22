"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { chaletService } from "@/lib/services/chalets";
import { pageService } from "@/lib/services/pages";
import { usePageViews } from "@/lib/hooks/usePageViews";
import { Chalet, Page } from "@/types";

// Notion dark style markdown parser
const parseMarkdown = (markdown: string) => {
  let html = markdown;
  
  // Headers avec style Notion sombre
  html = html.replace(/^### (.*$)/gm, '<h3 style="font-size: 1.25em; font-weight: 600; margin: 24px 0 4px 0; color: rgba(255, 255, 255, 0.9); line-height: 1.2;">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5em; font-weight: 600; margin: 28px 0 4px 0; color: rgba(255, 255, 255, 0.9); line-height: 1.2;">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 style="font-size: 2em; font-weight: 600; margin: 32px 0 4px 0; color: rgba(255, 255, 255, 0.9); line-height: 1.2;">$1</h1>');
  
  // Bold et italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: rgba(255, 255, 255, 0.9);">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: rgba(255, 255, 255, 0.9);">$1</em>');
  
  // Code avec style Notion
  html = html.replace(/`([^`]+)`/g, '<code style="background: rgba(135, 131, 120, 0.15); color: rgb(235, 87, 87); padding: 0.2em 0.4em; border-radius: 3px; font-size: 85%; font-family: \'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, Courier, monospace;">$1</code>');
  html = html.replace(/```([\\s\\S]*?)```/g, '<pre style="background: rgba(135, 131, 120, 0.15); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 3px; padding: 16px; margin: 8px 0; font-family: \'SFMono-Regular\', Consolas, \'Liberation Mono\', Menlo, Courier, monospace; font-size: 14px; line-height: 1.45; overflow-x: auto;"><code style="background: none; color: inherit; padding: 0;">$1</code></pre>');
  
  // Listes
  html = html.replace(/^\d+\. (.*)$/gm, '<li style="margin: 2px 0; color: rgba(255, 255, 255, 0.9);">$1</li>');
  html = html.replace(/^[-*] (.*)$/gm, '<li style="margin: 2px 0; color: rgba(255, 255, 255, 0.9);">$1</li>');
  html = html.replace(/(<li[^>]*>.*?<\/li>)/gs, '<ul style="margin: 4px 0; padding-left: 24px; color: rgba(255, 255, 255, 0.9);">$1</ul>');
  
  // Citations Notion style
  html = html.replace(/^> (.*)$/gm, '<blockquote style="border-left: 3px solid rgba(255, 255, 255, 0.2); padding-left: 14px; margin: 4px 0; color: rgba(255, 255, 255, 0.7); font-style: normal;">$1</blockquote>');
  
  // Liens
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: rgba(94, 138, 255, 1); text-decoration: underline; text-decoration-color: rgba(94, 138, 255, 0.4);" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Paragraphes avec style Notion
  html = html.replace(/\n\n/g, '</p><p style="margin: 3px 0; color: rgba(255, 255, 255, 0.9); min-height: 1em;">');
  html = `<p style="margin: 3px 0; color: rgba(255, 255, 255, 0.9); min-height: 1em;">${html}</p>`;
  
  // Nettoyage
  html = html.replace(/<p[^>]*>\s*<\/p>/g, "");
  html = html.replace(/<ul[^>]*>(<ul[^>]*>.*?<\/ul>)<\/ul>/gs, '$1');
  
  return html;
};

export default function NotionStylePageViewer() {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  usePageViews(page?._id || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chaletId = params.chaletId as string;
        const pageSlug = params.pageSlug as string;

        const [chaletData, pagesData] = await Promise.all([
          chaletService.getById(chaletId),
          pageService.getByChaletId(chaletId),
        ]);

        const pageData = pagesData.find(
          (p) => p.slug === pageSlug && p.isActive !== false
        );

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

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(37, 37, 37)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid rgba(255, 255, 255, 0.1)',
            borderTop: '3px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            margin: 0,
            fontSize: '14px'
          }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!chalet || !page) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'rgb(37, 37, 37)',
        color: 'rgba(255, 255, 255, 0.9)'
      }}>
        <div style={{
          maxWidth: '708px',
          margin: '0 auto',
          padding: '96px 96px 40px',
          minHeight: '100vh'
        }}>
          {/* Titre principal - Style Notion */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '40px',
              lineHeight: '1.2',
              fontWeight: '700',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 8px 0',
              wordBreak: 'break-word'
            }}>
              {page.title}
            </h1>
          </div>

          {/* Tags - Style Notion sombre */}
          {page.tags && page.tags.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              {page.tags.map((tag, index) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginRight: index < page.tags.length - 1 ? '6px' : '0',
                    marginBottom: '4px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta info */}
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginBottom: '48px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span>{chalet.name}</span>
            {page.views && page.views > 0 && (
              <span>{page.views} vues</span>
            )}
          </div>

          {/* Contenu - Style Notion sombre pur */}
          <div
            dangerouslySetInnerHTML={{ 
              __html: parseMarkdown(page.content) 
            }}
            style={{
              fontSize: '16px',
              lineHeight: '1.5'
            }}
          />

          {/* Footer minimaliste */}
          <div style={{
            marginTop: '64px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.09)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.4)',
              margin: '0 0 8px 0'
            }}>
              Besoin d'aide avec autre chose ?
            </p>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.4)',
              margin: '0'
            }}>
              Scannez un autre QR code ou contactez-nous.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}