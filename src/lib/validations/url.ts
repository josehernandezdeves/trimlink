import { z } from "zod";

/**
 * Dominios propios: si el usuario intentara acortar un link que ya
 * apunta a nuestro propio dominio, se evita para prevenir bucles de
 * redirección infinitos.
 */
const OWN_DOMAINS = ["localhost", "trimlink.app"];

const RESERVED_CODES = new Set([
  "dashboard",
  "login",
  "logout",
  "auth",
  "api",
  "link-invalid",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml"
]);

function isSafeUrl(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }

  // Solo protocolos http/https: bloquea javascript:, data:, file:, etc.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return false;
  }

  // Evita acortar el propio dominio (bucles de redirección).
  const hostname = parsed.hostname.toLowerCase();
  if (OWN_DOMAINS.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))) {
    return false;
  }

  // Bloquea IPs privadas / loopback típicas usadas en ataques SSRF.
  const privateIpPattern =
    /^(127\.|10\.|172\.(1[6-9]|2\d|3[0-1])\.|192\.168\.|0\.0\.0\.0|::1)/;
  if (privateIpPattern.test(hostname)) {
    return false;
  }

  return true;
}

export const createLinkSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, "La URL es obligatoria.")
    .max(2048, "La URL es demasiado larga.")
    .refine(isSafeUrl, {
      message: "La URL no es válida o no está permitida."
    }),
  alias: z
    .string()
    .trim()
    .toLowerCase()
    .max(30, "El alias no puede superar los 30 caracteres.")
    .regex(/^[a-z0-9-]*$/, "Solo se permiten letras, números y guiones.")
    .refine((alias) => alias === "" || !RESERVED_CODES.has(alias), {
      message: "Ese alias está reservado, elige otro."
    })
    .optional()
    .or(z.literal(""))
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

export const authSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido.")
});
