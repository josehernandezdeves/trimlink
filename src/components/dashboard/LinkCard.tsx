"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown, Copy, ExternalLink, MousePointerClick, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatsChart } from "@/components/dashboard/StatsChart";
import { deleteLink } from "@/lib/actions/links";
import { cn } from "@/lib/utils/cn";
import type { LinkWithStats } from "@/types/database";

export function LinkCard({ link }: { link: LinkWithStats }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleCopy() {
    await navigator.clipboard.writeText(link.short_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar el link "${link.code}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(() => deleteLink(link.id));
  }

  return (
    <Card className={cn("transition-opacity", isPending && "opacity-40")}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <a
            href={link.short_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 truncate font-semibold text-indigo-500 hover:underline"
          >
            {link.short_url.replace(/^https?:\/\//, "")}
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
          <p className="mt-1 truncate text-sm text-slate-400">
            {link.original_url}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-mint-50 px-3 py-1.5 text-sm font-medium text-mint-600">
            <MousePointerClick className="h-3.5 w-3.5" />
            {link.clicks_count}
          </div>

          <button
            onClick={handleCopy}
            className="rounded-full p-2.5 text-slate-400 transition-colors hover:bg-pearl hover:text-indigo-500"
            aria-label="Copiar enlace"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>

          <button
            onClick={handleDelete}
            className="rounded-full p-2.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            aria-label="Eliminar enlace"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2.5 text-slate-400 transition-colors hover:bg-pearl hover:text-indigo-500"
            aria-label="Ver estadísticas"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-5 border-t border-slate-100 pt-5 animate-fade-up">
          <StatsChart link={link} />
        </div>
      )}
    </Card>
  );
}
