"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Mail, Scissors } from "lucide-react";
import { signInWithMagicLink, type AuthState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WaveDivider } from "@/components/ui/WaveDivider";

const initialState: AuthState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" loading={pending} className="w-full">
      <Mail className="h-4 w-4" />
      Enviar enlace mágico
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(signInWithMagicLink, initialState);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-sky-50 to-cream px-6">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-100 blur-3xl" />

      <Card className="relative w-full max-w-md text-center">
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2 font-bold text-slate-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white">
            <Scissors className="h-4 w-4" />
          </span>
          TrimLink
        </Link>

        <h1 className="text-xl font-semibold text-slate-800">
          Entra sin contraseñas
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Te mandamos un enlace mágico a tu correo, un clic y estás dentro.
        </p>

        <form action={formAction} className="mt-6 flex flex-col gap-3">
          <Input
            name="email"
            type="email"
            required
            placeholder="tu@correo.com"
          />
          <SubmitButton />
        </form>

        {state.status === "error" && (
          <p className="mt-4 text-sm text-rose-500">{state.message}</p>
        )}
        {state.status === "success" && (
          <p className="mt-4 text-sm text-mint-600">{state.message}</p>
        )}
      </Card>

      <div className="absolute inset-x-0 bottom-0 -z-10">
        <WaveDivider color="#DFF3FC" />
      </div>
    </main>
  );
}
