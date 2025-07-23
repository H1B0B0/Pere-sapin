"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { BsLock, BsEnvelope } from "react-icons/bs";

import { authService } from "@/lib/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password });

      if (res && "token" in res && res.token) {
        document.cookie = `auth-token=${res.token}; path=/; max-age=${60 * 60 * 12}; SameSite=Lax`;
        router.push("/admin");
      } else {
        setError("Erreur de connexion");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect");
      } else if (err.response?.status === 400) {
        setError("Veuillez vérifier vos informations de connexion");
      } else if (err.response?.status >= 500) {
        setError("Erreur du serveur. Veuillez réessayer plus tard");
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        setError("Problème de connexion. Vérifiez votre connexion internet");
      } else {
        setError("Une erreur inattendue s'est produite");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="alpine-card">
          <CardHeader className="flex flex-col items-center pb-0">
            <span className="gradient-festive bg-clip-text text-transparent flex items-center gap-2 text-3xl font-bold font-display mb-2">
              <BsLock className="h-8 w-8 text-primary" />
              Connexion Admin
            </span>
            <p className="text-default-600 text-center mb-2">
              Connectez-vous pour accéder au panneau d&apos;administration.
            </p>
          </CardHeader>
          <CardBody>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                required
                disabled={loading}
                label="Email"
                placeholder="Votre adresse email"
                startContent={<BsEnvelope className="text-primary" />}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                required
                disabled={loading}
                label="Mot de passe"
                placeholder="Votre mot de passe"
                startContent={<BsLock className="text-primary" />}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.div>
              )}
              <Button
                className="font-semibold btn-alpine text-primary-foreground mt-2"
                color="primary"
                disabled={loading}
                isLoading={loading}
                type="submit"
              >
                Se connecter
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
