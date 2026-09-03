import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-card backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}
