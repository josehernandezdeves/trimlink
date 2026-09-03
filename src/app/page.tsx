import Link from "next/link";
import { Scissors } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

export default async function LandingPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500 text-white">
            <Scissors className="h-4 w-4" />
          </span>
          TrimLink
        </Link>

        {user ? (
          <Link
            href="/dashboard"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-card transition-colors hover:text-indigo-500"
          >
            Ir al panel
          </Link>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-card transition-colors hover:text-indigo-500"
          >
            Iniciar sesión
          </Link>
        )}
      </header>

      <Hero isAuthenticated={Boolean(user)} />
      <Features />

      <footer className="py-10 text-center text-sm text-slate-400">
        Hecho con Next.js, Supabase y mucho café. TrimLink · portfolio project.
      </footer>
    </main>
  );
}
