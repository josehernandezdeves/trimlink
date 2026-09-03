"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validations/url";

export interface AuthState {
  status: "idle" | "success" | "error";
  message?: string;
}

/** Envía un magic link de acceso al correo indicado (sin contraseñas). */
export async function signInWithMagicLink(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const parsed = authSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Correo inválido."
    };
  }

  const supabase = createClient();
  const origin = headers().get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    return { status: "error", message: "No se pudo enviar el enlace. Intenta de nuevo." };
  }

  return {
    status: "success",
    message: "¡Listo! Revisa tu correo para ingresar."
  };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
