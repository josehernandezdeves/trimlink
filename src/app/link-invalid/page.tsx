import Link from "next/link";
import { Clock, Link2Off } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LinkInvalidPage({
  searchParams
}: {
  searchParams: { reason?: string };
}) {
  const expired = searchParams.reason === "expired";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-cream px-6 text-center">
      <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-4xl bg-rose-50 text-rose-400 shadow-soft">
        {expired ? <Clock className="h-9 w-9" /> : <Link2Off className="h-9 w-9" />}
      </span>

      <h1 className="text-3xl font-bold text-slate-800">
        {expired ? "Este enlace expiró" : "Este enlace no existe"}
      </h1>
      <p className="mt-2 max-w-sm text-slate-500">
        {expired
          ? "El link corto que intentaste abrir dejó de estar disponible."
          : "Revisa que el código sea correcto — puede que nunca haya existido o haya sido eliminado."}
      </p>

      <Link href="/" className="mt-8">
        <Button size="lg">Crear mi propio link</Button>
      </Link>
    </main>
  );
}
