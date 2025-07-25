"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import YooptaEditor from "@yoopta/editor";

import { getChaletById } from "@/lib/services/chalets";
import { getPagesByChaletId } from "@/lib/services/pages";
import { usePageViews } from "@/lib/hooks/usePageViews";
import { Chalet, Page } from "@/types";

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
          getChaletById(chaletId),
          getPagesByChaletId(chaletId),
        ]);

        const pageData = pagesData.find(
          (p) => p.slug === pageSlug && p.isActive !== false,
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
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgb(37, 37, 37)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid rgba(255, 255, 255, 0.1)",
              borderTop: "3px solid rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              margin: 0,
              fontSize: "14px",
            }}
          >
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
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "rgb(37, 37, 37)",
          color: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <div
          style={{
            maxWidth: "708px",
            margin: "0 auto",
            padding: "96px 96px 40px",
            minHeight: "100vh",
          }}
        >
          {/* Titre principal - Style Notion */}
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "40px",
                lineHeight: "1.2",
                fontWeight: "700",
                color: "rgba(255, 255, 255, 0.9)",
                margin: "0 0 8px 0",
                wordBreak: "break-word",
              }}
            >
              {page.title}
            </h1>
          </div>

          {/* Tags - Style Notion sombre */}
          {page.tags && page.tags.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              {page.tags.map((tag, index) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-block",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.7)",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    fontSize: "12px",
                    fontWeight: "500",
                    marginRight: index < page.tags.length - 1 ? "6px" : "0",
                    marginBottom: "4px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta info */}
          <div
            style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.4)",
              marginBottom: "48px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span>{chalet.name}</span>
            {page.views && page.views > 0 && <span>{page.views} vues</span>}
          </div>

          {/* Contenu - Yoopta Editor en mode lecture seule */}
          <div
            style={{
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            <YooptaEditor
              className="notion-dark-theme"
              readOnly={true}
              value={page.content}
            />
          </div>

          {/* Footer minimaliste */}
          <div
            style={{
              marginTop: "64px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.09)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.4)",
                margin: "0 0 8px 0",
              }}
            >
              Besoin d'aide avec autre chose ?
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.4)",
                margin: "0",
              }}
            >
              Scannez un autre QR code ou contactez-nous.
            </p>
          </div>
        </div>
      </div>

      {/* Custom styles for the dark theme read-only editor */}
      <style global jsx>{`
        .notion-dark-theme .yoopta-editor {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor h1 {
          font-size: 2em !important;
          font-weight: 700 !important;
          margin: 32px 0 8px 0 !important;
          line-height: 1.2 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor h2 {
          font-size: 1.5em !important;
          font-weight: 600 !important;
          margin: 28px 0 4px 0 !important;
          line-height: 1.2 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor h3 {
          font-size: 1.25em !important;
          font-weight: 600 !important;
          margin: 24px 0 4px 0 !important;
          line-height: 1.2 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor p {
          margin: 3px 0 !important;
          color: rgba(255, 255, 255, 0.9) !important;
          min-height: 1em !important;
          line-height: 1.5 !important;
        }

        .notion-dark-theme .yoopta-editor strong {
          font-weight: 600 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor em {
          font-style: italic !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor code {
          background: rgba(135, 131, 120, 0.15) !important;
          color: rgb(235, 87, 87) !important;
          padding: 0.2em 0.4em !important;
          border-radius: 3px !important;
          font-size: 85% !important;
          font-family:
            "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
            monospace !important;
        }

        .notion-dark-theme .yoopta-editor pre {
          background: rgba(135, 131, 120, 0.15) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 3px !important;
          padding: 16px !important;
          margin: 8px 0 !important;
          font-family:
            "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
            monospace !important;
          font-size: 14px !important;
          line-height: 1.45 !important;
          overflow-x: auto !important;
        }

        .notion-dark-theme .yoopta-editor blockquote {
          border-left: 3px solid rgba(255, 255, 255, 0.2) !important;
          padding-left: 14px !important;
          margin: 4px 0 !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-style: normal !important;
        }

        .notion-dark-theme .yoopta-editor ul,
        .notion-dark-theme .yoopta-editor ol {
          margin: 4px 0 !important;
          padding-left: 24px !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor li {
          margin: 2px 0 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .notion-dark-theme .yoopta-editor a {
          color: rgba(94, 138, 255, 1) !important;
          text-decoration: underline !important;
          text-decoration-color: rgba(94, 138, 255, 0.4) !important;
        }

        /* Hide any editor UI in read-only mode */
        .notion-dark-theme .yoopta-editor [contenteditable="false"] {
          outline: none !important;
        }
      `}</style>
    </>
  );
}
