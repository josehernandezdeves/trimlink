import Link from "next/link";
import { Scissors, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-cream px-6 text-center">
      <span className="mb-6 flex h-20 w-20 items-center justify-center rounded-4xl bg-indigo-50 text-indigo-400 shadow-soft">
        <SearchX className="h-9 w-9" />
      </span>
      <h1 className="text-3xl font-bold text-slate-800">Página no encontrada</h1>
      <p className="mt-2 max-w-sm text-slate-500">
        No encontramos lo que buscabas. Puede que la ruta esté mal escrita.
      </p>
      <Link href="/" className="mt-8">
        <Button size="lg">
          <Scissors className="h-4 w-4" />
          Volver a TrimLink
        </Button>
      </Link>
    </main>
  );
}
