import { Gauge, Globe2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Gauge,
    title: "Redirección en el Edge",
    description:
      "Cada clic se resuelve en el middleware de Next.js, lo más cerca posible del usuario, sin pasar por un servidor central.",
    tint: "bg-indigo-50 text-indigo-500"
  },
  {
    icon: Globe2,
    title: "Analíticas con contexto",
    description:
      "Ve de qué país llegan tus clics y desde qué tipo de dispositivo, con gráficos simples y directos al grano.",
    tint: "bg-mint-50 text-mint-600"
  },
  {
    icon: ShieldCheck,
    title: "Privado por diseño",
    description:
      "Nunca guardamos tu IP en texto plano. Se deriva el país en el Edge y, si hace falta, se hashea con salt antes de descartarla.",
    tint: "bg-sky-100 text-sky-600"
  }
];

export function Features() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <h2 className="text-3xl font-bold text-slate-800">
            Todo lo que necesitas, nada de lo que sobra
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description, tint }) => (
            <Card key={title} className="text-left">
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${tint}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-800">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
