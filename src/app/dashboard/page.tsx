import { redirect } from "next/navigation";
import { Scissors } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUserLinksWithStats } from "@/lib/actions/links";
import { ShortenForm } from "@/components/landing/ShortenForm";
import { LinkList } from "@/components/dashboard/LinkList";
import { SignOutButton } from "@/components/dashboard/SignOutButton";
import { Card } from "@/components/ui/Card";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const links = await getUserLinksWithStats();
  const totalClicks = links.reduce((sum, l) => sum + l.clicks_count, 0);

  return (
    <main className="min-h-screen bg-pearl/40 pb-20">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500 text-white">
            <Scissors className="h-4 w-4" />
          </span>
          TrimLink
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-400 sm:inline">
            {user.email}
          </span>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Links creados</p>
              <p className="text-3xl font-bold text-slate-800">{links.length}</p>
            </div>
          </Card>
          <Card className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Clics totales</p>
              <p className="text-3xl font-bold text-slate-800">{totalClicks}</p>
            </div>
          </Card>
        </div>

        <div className="mb-10">
          <ShortenForm isAuthenticated />
        </div>

        <h2 className="mb-4 text-lg font-semibold text-slate-800">Tus enlaces</h2>
        <LinkList links={links} />
      </div>
    </main>
  );
}
