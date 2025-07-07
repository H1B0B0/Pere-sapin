"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Spacer } from "@heroui/spacer";
import { Spinner } from "@heroui/spinner";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/lib/auth-store";
import {
  EyeIcon,
  EyeSlashIcon,
  HomeIcon,
  ShieldCheckIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";

export default function AdminLogin() {
  const router = useRouter();
  const { user, login, initialized } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (initialized && user) {
      console.log("🔄 Login: User already authenticated, redirecting");
      // Small delay to prevent loop
      setTimeout(() => {
        router.replace("/admin");
      }, 100);
      return;
    }
  }, [initialized, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    console.log("🔐 Login: Attempting login with:", formData.email);
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(formData);
      console.log("✅ Login: Success", response);
      login(response.user, response.token);
      router.replace("/admin");
    } catch (err: any) {
      console.error("❌ Login: Error", err);
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: "admin@pere-sapin.com",
      password: "admin123",
    });
  };

  // Don't render anything while checking auth status
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Don't render if already authenticated (will redirect)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 via-white to-secondary-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <QrCodeIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Père Sapin Admin
          </h1>
          <p className="text-gray-600">Gestion des chalets et codes QR</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-6 pt-8 px-8">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Connexion
                </h2>
              </div>
              <p className="text-gray-500 text-sm">
                Accédez à votre espace d'administration
              </p>
            </div>
          </CardHeader>

          <CardBody className="px-8 pb-6">
            {/* Error Alert */}
            {error && (
              <>
                <Card className="bg-danger-50 border-danger-200 border-1">
                  <CardBody className="py-3 px-4">
                    <p className="text-danger-600 text-sm text-center font-medium">
                      {error}
                    </p>
                  </CardBody>
                </Card>
                <Spacer y={4} />
              </>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Adresse email"
                placeholder="votre@email.com"
                variant="bordered"
                value={formData.email}
                onValueChange={handleChange("email")}
                isRequired
                isDisabled={loading}
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "border-gray-200 hover:border-primary-300 focus-within:border-primary-500",
                }}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-gray-400 text-sm">@</span>
                  </div>
                }
              />

              <Input
                label="Mot de passe"
                placeholder="Votre mot de passe"
                variant="bordered"
                value={formData.password}
                onValueChange={handleChange("password")}
                isRequired
                isDisabled={loading}
                type={isPasswordVisible ? "text" : "password"}
                classNames={{
                  input: "text-sm",
                  inputWrapper:
                    "border-gray-200 hover:border-primary-300 focus-within:border-primary-500",
                }}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                  >
                    {isPasswordVisible ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                }
              />

              <Spacer y={2} />

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={loading}
                isDisabled={loading || !formData.email || !formData.password}
                className="w-full font-semibold"
                spinner={<Spinner size="sm" color="white" />}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardBody>

          <CardFooter className="px-8 pb-8 pt-4">
            <div className="w-full">
              {/* Demo Credentials */}
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-primary-800">
                    Identifiants de démonstration
                  </h3>
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="text-xs"
                  >
                    DEMO
                  </Chip>
                </div>
                <div className="space-y-2 text-sm text-primary-700">
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="font-mono text-xs">
                      admin@pere-sapin.com
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Mot de passe:</span>
                    <span className="font-mono text-xs">admin123</span>
                  </div>
                </div>
                <Spacer y={3} />
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={fillDemoCredentials}
                  isDisabled={loading}
                  className="w-full text-xs"
                >
                  Remplir automatiquement
                </Button>
              </div>

              <Spacer y={4} />

              {/* Back to site link */}
              <div className="text-center">
                <Button
                  as="a"
                  href="/"
                  variant="light"
                  size="sm"
                  startContent={<HomeIcon className="w-4 h-4" />}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Retour au site
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © 2025 Père Sapin - Gestion de chalets
          </p>
        </div>
      </div>
    </div>
  );
}
