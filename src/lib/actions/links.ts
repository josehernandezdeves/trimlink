"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createLinkSchema } from "@/lib/validations/url";
import { generateShortCode } from "@/lib/utils/nanoid";
import type { DeviceType, LinkWithStats } from "@/types/database";

export interface CreateLinkState {
  status: "idle" | "success" | "error";
  message?: string;
  shortUrl?: string;
}

/**
 * Server Action: crea un link corto.
 * Valida con Zod, genera (o reutiliza) el código, y persiste vía Supabase
 * respetando RLS (el usuario debe estar autenticado).
 */
export async function createLink(
  _prevState: CreateLinkState,
  formData: FormData
): Promise<CreateLinkState> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Debes iniciar sesión para crear links." };
  }

  const parsed = createLinkSchema.safeParse({
    originalUrl: formData.get("originalUrl"),
    alias: formData.get("alias") ?? ""
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Datos inválidos."
    };
  }

  const { originalUrl, alias } = parsed.data;
  const code = alias && alias.length > 0 ? alias : generateShortCode();

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    code,
    original_url: originalUrl
  });

  if (error) {
    const message =
      error.code === "23505"
        ? "Ese alias ya está en uso, prueba con otro."
        : "No se pudo crear el link. Intenta de nuevo.";
    return { status: "error", message };
  }

  revalidatePath("/dashboard");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    status: "success",
    shortUrl: `${siteUrl.replace(/\/$/, "")}/${code}`
  };
}

/** Elimina un link (RLS garantiza que solo el dueño puede hacerlo). */
export async function deleteLink(linkId: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("links").delete().eq("id", linkId);
  revalidatePath("/dashboard");
}

/** Trae todos los links del usuario autenticado junto a sus métricas agregadas. */
export async function getUserLinksWithStats(): Promise<LinkWithStats[]> {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });

  if (!links || links.length === 0) return [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const results = await Promise.all(
    links.map(async (link): Promise<LinkWithStats> => {
      const { data: clicks } = await supabase
        .from("clicks")
        .select("country, device_type")
        .eq("link_id", link.id);

      const countryCounts = new Map<string, number>();
      const deviceCounts = new Map<DeviceType | "unknown", number>();

      for (const click of clicks ?? []) {
        const country = click.country ?? "XX";
        countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);

        const device = (click.device_type as DeviceType | null) ?? "unknown";
        deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);
      }

      return {
        ...link,
        short_url: `${siteUrl.replace(/\/$/, "")}/${link.code}`,
        clicks_by_country: Array.from(countryCounts.entries())
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count),
        clicks_by_device: Array.from(deviceCounts.entries()).map(
          ([device, count]) => ({ device, count })
        )
      };
    })
  );

  return results;
}
