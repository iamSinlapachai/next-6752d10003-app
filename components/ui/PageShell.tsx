import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  align?: "center" | "start";
  className?: string;
};

export function PageShell({
  children,
  align = "center",
  className,
}: PageShellProps) {
  return (
    <main
      className={cn(
        "flex min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8",
        align === "center" ? "items-center" : "items-start",
        "justify-center"
      )}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </main>
  );
}
