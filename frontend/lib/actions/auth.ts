"use server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5042";

export async function loginAction(_prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Veuillez remplir tous les champs" };
  }

  try {
    console.log(
      `[LOGIN] Attempting login for ${email} to ${API_BASE_URL}/auth/login`
    );

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    console.log(`[LOGIN] Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[LOGIN] Error response:`, errorText);

      if (response.status === 401) {
        return { success: false, error: "Email ou mot de passe incorrect" };
      }

      return { success: false, error: "Erreur de connexion" };
    }

    const data = await response.json();
    console.log("[LOGIN] Success response:", data);

    // Extract and set the auth cookie from Set-Cookie header
    const setCookieHeader = response.headers.get("set-cookie");
    if (setCookieHeader) {
      const authTokenMatch = setCookieHeader.match(/auth-token=([^;]+)/);
      if (authTokenMatch) {
        const cookieStore = await cookies();
        cookieStore.set("auth-token", authTokenMatch[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 24 * 60 * 60, // 24 hours
        });
      }
    }

    if (data && data.user) {
      return { success: true, error: "", user: data.user };
    }

    return { success: false, error: "Erreur de connexion" };
  } catch (error: any) {
    console.error("Login error:", error);

    if (
      error?.message?.includes("ECONNREFUSED") ||
      error?.code === "ECONNREFUSED"
    ) {
      return { success: false, error: "Impossible de se connecter au serveur" };
    }

    return { success: false, error: "Une erreur inattendue s'est produite" };
  }
}
