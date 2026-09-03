import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { detectDeviceType } from "@/lib/utils/device";

/**
 * Rutas de la propia app que NUNCA deben tratarse como un código corto.
 */
const APP_ROUTES = new Set([
  "dashboard",
  "login",
  "logout",
  "auth",
  "link-invalid"
]);

/**
 * Genera un hash SHA-256 con salt de la IP usando Web Crypto (disponible
 * en el runtime Edge). La IP en crudo nunca se persiste ni se loggea:
 * se usa únicamente en memoria para calcular el hash y luego se descarta.
 */
async function hashIp(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);

  // Deja pasar la home, assets, api routes y páginas propias sin tocar.
  const firstSegment = segments[0];
  if (segments.length === 0 || (firstSegment && APP_ROUTES.has(firstSegment))) {
    const response = NextResponse.next();
    // Mantiene viva la sesión de Supabase (refresh de cookies) en rutas de app.
    createMiddlewareClient(request, response);
    return response;
  }

  // Solo tratamos como "código corto" rutas de un único segmento, ej: /aB3xQ9z
  if (segments.length !== 1) {
    return NextResponse.next();
  }

  const code = segments[0];
  if (!code) {
    return NextResponse.next();
  }
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  const { data: link, error } = await supabase
    .from("links")
    .select("id, original_url, expires_at")
    .eq("code", code)
    .maybeSingle();

  if (error || !link) {
    return NextResponse.redirect(new URL("/link-invalid", request.url));
  }

  if (link.expires_at && new Date(link.expires_at).getTime() < Date.now()) {
    return NextResponse.redirect(
      new URL("/link-invalid?reason=expired", request.url)
    );
  }

  // ---------- Tracking anónimo (GDPR friendly) ----------
  // País: se toma directamente de los headers de geolocalización del
  // Edge (Vercel los inyecta automáticamente) — nunca de la IP guardada.
  const country =
    request.geo?.country ??
    request.headers.get("x-vercel-ip-country") ??
    "XX";

  const deviceType = detectDeviceType(request.headers.get("user-agent"));

  // Si se necesitara un identificador anti-abuso, se hashea con salt y
  // se descarta la IP inmediatamente: nunca se guarda en texto plano.
  const salt = process.env.IP_HASH_SALT ?? "trimlink-dev-salt";
  const rawIp =
    request.ip ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ipHash = rawIp ? await hashIp(rawIp, salt) : null;

  // Fire-and-forget: no bloquea la redirección al usuario final.
  supabase
    .from("clicks")
    .insert({
      link_id: link.id,
      country,
      device_type: deviceType,
      ip_hash: ipHash
    })
    .then(() => undefined);

  return NextResponse.redirect(new URL(link.original_url));
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas EXCEPTO:
     * - _next/static, _next/image (assets internos de Next)
     * - archivos estáticos con extensión (favicon.ico, imágenes, etc.)
     */
    "/((?!_next/static|_next/image|.*\\..*).*)"
  ]
};
