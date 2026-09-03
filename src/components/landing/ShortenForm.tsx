"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Check, Copy, Link2, Sparkles } from "lucide-react";
import { createLink, type CreateLinkState } from "@/lib/actions/links";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const initialState: CreateLinkState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" loading={pending} className="shrink-0">
      <Sparkles className="h-4 w-4" />
      Acortar
    </Button>
  );
}

interface ShortenFormProps {
  isAuthenticated: boolean;
}

export function ShortenForm({ isAuthenticated }: ShortenFormProps) {
  const [state, formAction] = useFormState(createLink, initialState);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  async function handleCopy() {
    if (!state.shortUrl) return;
    await navigator.clipboard.writeText(state.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/60 p-8 text-center">
        <Link2 className="mx-auto mb-3 h-8 w-8 text-indigo-500" />
        <p className="text-slate-600">
          Inicia sesión para empezar a acortar y trackear tus enlaces.
        </p>
        <a
          href="/login"
          className="mt-5 inline-flex h-14 items-center justify-center rounded-full bg-indigo-500 px-8 text-base font-medium text-white shadow-soft transition-colors hover:bg-indigo-600"
        >
          Entrar gratis
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form
        ref={formRef}
        action={formAction}
        className="flex flex-col gap-3 rounded-3xl bg-white/90 p-3 shadow-soft sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-3 rounded-full bg-pearl/60 px-2">
          <Link2 className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
          <Input
            name="originalUrl"
            type="url"
            required
            placeholder="Pega tu URL larga aquí…"
            className="border-none bg-transparent shadow-none focus:ring-0"
          />
        </div>
        <Input
          name="alias"
          placeholder="alias (opcional)"
          className="sm:w-40"
          maxLength={30}
        />
        <SubmitButton />
      </form>

      {state.status === "error" && (
        <p className="mt-3 text-center text-sm text-rose-500">{state.message}</p>
      )}

      {state.status === "success" && state.shortUrl && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-full bg-mint-50 px-5 py-3 text-mint-600 animate-fade-up">
          <span className="font-medium">{state.shortUrl}</span>
          <button
            onClick={handleCopy}
            type="button"
            className="rounded-full p-1.5 transition-colors hover:bg-mint-100"
            aria-label="Copiar enlace"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
