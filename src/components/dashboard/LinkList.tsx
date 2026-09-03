import { Inbox } from "lucide-react";
import { LinkCard } from "@/components/dashboard/LinkCard";
import type { LinkWithStats } from "@/types/database";

export function LinkList({ links }: { links: LinkWithStats[] }) {
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/60 py-16 text-center">
        <Inbox className="mb-3 h-10 w-10 text-slate-300" />
        <p className="text-slate-500">Todavía no creaste ningún link.</p>
        <p className="text-sm text-slate-400">
          Usa el formulario de arriba para acortar tu primera URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
