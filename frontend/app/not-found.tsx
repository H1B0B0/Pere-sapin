"use client";
import Link from "next/link";
import { BsTree } from "react-icons/bs";
import { motion } from "framer-motion";

import Background from "@/components/Background";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <div className="absolute inset-0 -z-10 w-full h-full">
        <Background />
      </div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center mb-4">
          <BsTree className="h-16 w-16 text-primary drop-shadow-lg" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-display gradient-festive bg-clip-text text-transparent mb-2">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
          Oups ! Page introuvable
        </h2>
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-8 text-foreground dark:text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
          <br />
          Retournez à l'accueil pour retrouver la magie de Père Sapin !
        </p>
        <Link
          className="inline-block btn-alpine text-primary-foreground px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
          href="/"
        >
          Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
