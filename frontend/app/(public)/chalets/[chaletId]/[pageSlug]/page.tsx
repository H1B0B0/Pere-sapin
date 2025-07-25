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
            <YooptaEditor className="" readOnly={true} value={page.content} />
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
    </>
  );
}
