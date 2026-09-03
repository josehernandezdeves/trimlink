import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    alias: string;
  }> | {
    alias: string;
  };
}

export async function GET(request: NextRequest, props: Props) {
  // Aceptar params tanto si es promesa (Next.js 15) como si es objeto directo
  const resolvedParams = await props.params;
  const alias = resolvedParams.alias;

  if (!alias || alias === "favicon.ico") {
    return new NextResponse("Not found", { status: 404 });
  }

  const supabase = createClient();

  // Usamos .ilike para buscar sin importar si escribieron mayúsculas o minúsculas
  const { data: link, error } = await supabase
    .from("links")
    .select("id, original_url, clicks_count")
    .ilike("code", alias)
    .single();

  if (error || !link) {
    return NextResponse.redirect(new URL("/link-invalid", request.url));
  }

  // Incrementar el contador de clics
  await supabase
    .from("links")
    .update({ clicks_count: (link.clicks_count || 0) + 1 })
    .eq("id", link.id);

  // Redirigir a la URL original de destino
  return NextResponse.redirect(link.original_url);
}