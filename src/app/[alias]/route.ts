import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: {
    alias: string;
  };
}

export async function GET(request: NextRequest, { params }: Props) {
  const { alias } = params;

  if (!alias || alias === "favicon.ico") {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = createClient();

  // 1. Buscar usando 'code' y seleccionando 'clicks_count'
  const { data: link, error } = await supabase
    .from("links")
    .select("id, original_url, clicks_count")
    .eq("code", alias)
    .single();

  // 2. Si no existe el enlace, redirigir a inválido
  if (error || !link) {
    return NextResponse.redirect(new URL("/link-invalid", request.url));
  }

  // 3. Incrementar el contador usando 'clicks_count'
  await supabase
    .from("links")
    .update({ clicks_count: (link.clicks_count || 0) + 1 })
    .eq("id", link.id);

  // 4. Redirigir a la URL original de destino
  return NextResponse.redirect(link.original_url);
}