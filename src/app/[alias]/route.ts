import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: {
    alias: string;
  };
}

export async function GET(request: NextRequest, { params }: Props) {
  const { alias } = params;

  // Evitar que interfiera con rutas estáticas comunes si las hubiera
  if (!alias || alias === "favicon.ico") {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = createClient();

  // 1. Buscar el enlace en tu base de datos usando el campo correspondiente (ej. short_code o alias)
  const { data: link, error } = await supabase
    .from("links") // Asegúrate de que el nombre de tu tabla sea este
    .select("id, original_url, clicks")
    .eq("short_code", alias) // Cambia 'short_code' por el nombre de tu columna en Supabase si es diferente
    .single();

  // 2. Si no existe el enlace, redirigir a una página de enlace inválido
  if (error || !link) {
    return NextResponse.redirect(new URL("/link-invalid", request.url));
  }

  // 3. Incrementar el contador de clics en segundo plano
  await supabase
    .from("links")
    .update({ clicks: (link.clicks || 0) + 1 })
    .eq("id", link.id);

  // 4. Redirigir a la URL original de destino
  return NextResponse.redirect(link.original_url);
}