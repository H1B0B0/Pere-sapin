export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Père Sapin",
  description:
    "Découvrez nos chalets enchantés pour des vacances de Noël magiques en famille.",
  navItems: [
    {
      label: "Accueil",
      href: "/",
    },
    {
      label: "Chalets",
      href: "/chalets",
    },
    {
      label: "Réservations",
      href: "/booking",
    },
    {
      label: "À propos",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ],
  navMenuItems: [
    {
      label: "Accueil",
      href: "/",
    },
    {
      label: "Chalets",
      href: "/chalets",
    },
    {
      label: "Réservations",
      href: "/booking",
    },
    {
      label: "À propos",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Mon Compte",
      href: "/profile",
    },
    {
      label: "Mes Réservations",
      href: "/my-bookings",
    },
    {
      label: "Connexion",
      href: "/login",
    },
  ],
  links: {
    github: "https://github.com/votre-repo/pere-sapin",
    contact: "/contact",
    booking: "/booking",
  },
};
