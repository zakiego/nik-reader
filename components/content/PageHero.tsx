import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

/** Page hero holding the single <h1> and a lead paragraph. */
export const PageHero = ({
  title,
  lead,
  size = "md",
  className,
}: {
  title: string;
  lead: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) => (
  <div className={cn("mt-8 sm:mt-12", className)}>
    <h1
      className={cn(
        "text-balance font-bold tracking-[-0.025em]",
        size === "lg"
          ? "text-[2.125rem] leading-[1.08] sm:text-5xl sm:leading-[1.04]"
          : "text-[1.875rem] leading-[1.12] sm:text-[2.5rem] sm:leading-[1.08]",
      )}
    >
      {title}
    </h1>
    <p className="mt-4 max-w-[58ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
      {lead}
    </p>
  </div>
);
