import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        "w-full rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-100 sm:p-8",
        className
      )}
    >
      {children}
    </section>
  );
}
