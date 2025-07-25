"use server";
import { cookies } from "next/headers";
import { createApiClient } from "@/lib/api";

export async function loginAction(_prevState: any, formData: FormData) {
  console.log("=== LOGIN ACTION CALLED ===");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  console.log("Form data:", { email, password: password ? "***" : null });

  if (!email || !password) {
    console.log("Missing email or password");
    return { success: false, error: "Veuillez remplir tous les champs" };
  }

  try {
    console.log("Making login request with fetch...");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://backend:5042";
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok && data.user) {
      // The backend should have set the cookie, but we need to extract it from the response
      // and set it on the Next.js side for middleware to work
      const setCookieHeader = response.headers.get('set-cookie');
      console.log("Set-Cookie header:", setCookieHeader);
      if (setCookieHeader) {
        // Parse the auth-token from the set-cookie header
        const tokenMatch = setCookieHeader.match(/auth-token=([^;]+)/);
        if (tokenMatch) {
          const token = tokenMatch[1];
          console.log("Extracted token:", token ? "present" : "missing");
          const cookieStore = await cookies();
          cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
            path: "/",
          });
          console.log("Cookie set successfully on Next.js side");
        }
      }
      
      return { success: true, error: "", user: data.user };
    }

    return { success: false, error: "Erreur de connexion" };
  } catch (error: any) {
    console.error("Login error:", error);

    if (error?.message?.includes("ECONNREFUSED") || error?.code === 'ECONNREFUSED') {
      return { success: false, error: "Impossible de se connecter au serveur" };
    }

    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
}
