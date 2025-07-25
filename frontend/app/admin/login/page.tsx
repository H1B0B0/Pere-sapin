"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { BsLock, BsEnvelope } from "react-icons/bs";

import { loginAction } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="font-semibold btn-alpine text-primary-foreground mt-2"
      color="primary"
      disabled={pending}
      isLoading={pending}
      type="submit"
    >
      Se connecter
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, {
    success: false,
    error: "",
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/admin");
    }
  }, [state.success, router]);

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
            <form className="flex flex-col gap-4" action={formAction}>
              <Input
                required
                label="Email"
                name="email"
                placeholder="Votre adresse email"
                startContent={<BsEnvelope className="text-primary" />}
                type="email"
              />
              <Input
                required
                label="Mot de passe"
                name="password"
                placeholder="Votre mot de passe"
                startContent={<BsLock className="text-primary" />}
                type="password"
              />
              {state.error && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                >
                  {state.error}
                </motion.div>
              )}
              <SubmitButton />
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
