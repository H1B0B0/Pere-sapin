import { notFound } from "next/navigation";
import { getChaletBySlug, getAllChaletSlugs } from "@/data/chalets";
import type { Metadata } from "next";
import ChaletDetailClient from "./ChaletDetailClient";

interface Props {
  params: { slug: string };
}

// Génération statique des pages
export async function generateStaticParams() {
  return getAllChaletSlugs().map((slug) => ({
    slug,
  }));
}

// Métadonnées dynamiques pour le SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chalet = getChaletBySlug(params.slug);
  
  if (!chalet) {
    return {
      title: 'Chalet non trouvé',
    };
  }

  return {
    title: `Chalet ${chalet.name} - Location 3★ dans les Vosges | Père Sapin`,
    description: `${chalet.description} ${chalet.capacity}, ${chalet.rooms}. Réservez dès maintenant votre séjour dans ce magnifique chalet 3 étoiles.`,
    keywords: `chalet ${chalet.name.toLowerCase()}, location chalet vosges, chalet 3 étoiles, père sapin, ${chalet.features.slice(0, 5).join(', ').toLowerCase()}`,
    openGraph: {
      title: `Chalet ${chalet.name} - Père Sapin`,
      description: chalet.description,
      images: [
        {
          url: chalet.images[0],
          width: 1200,
          height: 600,
          alt: `Chalet ${chalet.name} - Père Sapin`,
        },
      ],
    },
  };
}

export default function ChaletDetailPage({ params }: Props) {
  const chalet = getChaletBySlug(params.slug);

  if (!chalet) {
    notFound();
  }

  return <ChaletDetailClient chalet={chalet} />;
}