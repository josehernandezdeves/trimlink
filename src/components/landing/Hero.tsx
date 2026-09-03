import { ShortenForm } from "@/components/landing/ShortenForm";
import { WaveDivider } from "@/components/ui/WaveDivider";

interface HeroProps {
  isAuthenticated: boolean;
}

export function Hero({ isAuthenticated }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-indigo-50/40 to-transparent pb-28 pt-24">
      <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full bg-mint-100 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-16 h-64 w-64 rounded-full bg-indigo-100 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-indigo-500 shadow-card">
          Analíticas en tiempo real · Sin cookies invasivas
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-800 sm:text-6xl">
          Enlaces cortos,
          <br />
          <span className="text-indigo-500">insights largos.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500">
          TrimLink acorta tus URLs y te muestra de dónde vienen tus clics —
          país y dispositivo — sin guardar jamás una IP en crudo.
        </p>

        <div className="mt-10">
          <ShortenForm isAuthenticated={isAuthenticated} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <WaveDivider color="#FBF9F6" />
      </div>
    </section>
  );
}
