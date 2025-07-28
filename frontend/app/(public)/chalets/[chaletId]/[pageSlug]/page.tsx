"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, notFound } from "next/navigation";
import { Card, CardBody, Chip, Spinner } from "@heroui/react";
import YooptaEditor, { createYooptaEditor } from "@yoopta/editor";

import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Video from "@yoopta/video";
import File from "@yoopta/file";
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

import { getChaletById } from "@/lib/services/chalets";
import { getPagesByChaletId } from "@/lib/services/pages";
import { usePageViews } from "@/lib/hooks/usePageViews";
import { Chalet, Page } from "@/types";

const plugins = [
  Paragraph,
  Table,
  Divider,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  Image.extend({
    options: {
      async onUpload(file) {
        // Pour le mode lecture seule, on convertit en base64
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              src: reader.result as string,
              alt: file.name,
              sizes: {
                width: 800,
                height: 600,
              },
            });
          };
          reader.readAsDataURL(file);
        });
      },
    },
  }),
  Video,
  File,
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

export default function NotionStylePageViewer() {
  const [chalet, setChalet] = useState<Chalet | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

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
          <Spinner size="lg" color="primary" style={{ marginBottom: "16px" }} />
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header avec titre et meta */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            {page.title}
          </h1>
          
          {/* Tags */}
          {page.tags && Array.isArray(page.tags) && page.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {page.tags.map((tag, index) => (
                <Chip
                  key={`${tag}-${index}`}
                  variant="flat"
                  size="sm"
                  color="primary"
                >
                  {tag}
                </Chip>
              ))}
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-default-500 border-b border-divider pb-6">
            <span className="flex items-center gap-2">
              📍 {chalet.name}
            </span>
            {page.views && page.views > 0 && (
              <span className="flex items-center gap-2">
                👁️ {page.views} vue{page.views !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Contenu */}
        <Card className="bg-content1">
          <CardBody className="p-8">
            <div ref={selectionRef}>
              <YooptaEditor
                editor={editor}
                plugins={plugins}
                tools={TOOLS}
                marks={MARKS}
                selectionBoxRoot={selectionRef}
                value={(() => {
                  try {
                    const parsedContent =
                      typeof page.content === "string"
                        ? JSON.parse(page.content)
                        : page.content;

                    if (!parsedContent || typeof parsedContent !== "object") {
                      return {};
                    }

                    return parsedContent;
                  } catch (e) {
                    console.error("Erreur lors du parsing du contenu:", e);
                    return {};
                  }
                })()}
                readOnly
              />
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-divider text-center">
          <p className="text-default-500 text-sm">
            💡 Besoin d'aide ? Scannez un autre QR code ou contactez-nous
          </p>
        </div>
      </div>
    </div>
  );
}
