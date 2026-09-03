import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    alias: string;
  }> | {
    alias: string;
  };
}

export default async function ShortLinkPage(props: Props) {
  const resolvedParams = await props.params;
  const alias = resolvedParams.alias;

  if (!alias || alias === "favicon.ico") {
    redirect("/link-invalid");
  }

  const supabase = createClient();

  // Buscar el enlace en Supabase (insensible a mayúsculas/minúsculas)
  const { data: link, error } = await supabase
    .from("links")
    .select("id, original_url, clicks_count")
    .ilike("code", alias)
    .single();

  // Si no existe, mandar a la página de enlace inválido
  if (error || !link) {
    redirect("/link-invalid");
  }

  // Incrementar el contador de clics de forma segura
  await supabase
    .from("links")
    .update({ clicks_count: (link.clicks_count || 0) + 1 })
    .eq("id", link.id);

  // Redirigir a la URL de destino original
  redirect(link.original_url);
}