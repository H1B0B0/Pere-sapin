"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/auth-store";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, initialized } = useAuthStore();
  const initializeRef = useRef(false);

  useEffect(() => {
    if (!initializeRef.current && !initialized) {
      console.log("🚀 AuthProvider: Initializing auth...");
      initializeRef.current = true;
      initialize();
    }
  }, [initialize, initialized]);

  return <>{children}</>;
}
