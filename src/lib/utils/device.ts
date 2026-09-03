import type { DeviceType } from "@/types/database";

/**
 * Clasifica el dispositivo a partir del User-Agent sin dependencias
 * externas, para poder ejecutarse en el runtime Edge del middleware.
 */
export function detectDeviceType(userAgent: string | null): DeviceType {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();

  const isTablet = /ipad|tablet|nexus 7|nexus 10|kfapwi/.test(ua);
  if (isTablet) return "tablet";

  const isMobile =
    /iphone|ipod|android.*mobile|windows phone|blackberry|bb10|mobile safari/.test(
      ua
    );
  if (isMobile) return "mobile";

  return "desktop";
}
