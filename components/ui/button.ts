import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "link";

type ButtonSize = "sm" | "md" | "lg";

type ButtonVariantOptions = {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: ButtonSize;
};

export function buttonVariants({
  variant = "primary",
  fullWidth = true,
  size = "md",
}: ButtonVariantOptions = {}) {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-5 py-3 text-base",
  };

  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
    fullWidth && "w-full",
    sizeClasses[size],
    variant === "primary" && "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
    variant === "secondary" && "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
    variant === "danger" && "bg-red-600 text-white shadow-sm hover:bg-red-700",
    variant === "link" && "text-blue-600 hover:text-blue-700 hover:underline",
    "disabled:cursor-not-allowed disabled:opacity-70"
  );
}
