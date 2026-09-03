import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-indigo-500 text-white hover:bg-indigo-600 shadow-soft disabled:bg-indigo-300",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600",
  ghost: "bg-transparent text-slate-600 hover:bg-pearl",
  danger: "bg-white text-rose-500 border border-rose-100 hover:bg-rose-50"
};

const sizes = {
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base"
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
