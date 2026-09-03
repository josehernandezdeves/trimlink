import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-2xl bg-[linear-gradient(90deg,#F1F0FB_25%,#E7E5FB_37%,#F1F0FB_63%)] bg-[length:400px_100%]",
        className
      )}
    />
  );
}
