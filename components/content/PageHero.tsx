import type { ReactNode } from "react";

/**
 * Page hero holding the single <h1>, an optional kicker, a lead paragraph, and
 * optional slot content (trust chips, CTA). Parts fade up in a short stagger so
 * the page assembles top-to-bottom instead of popping in at once.
 */
export const PageHero = ({
  kicker,
  title,
  lead,
  children,
  size = "md",
  className = "mt-8",
}: {
  kicker?: string;
  title: string;
  lead: ReactNode;
  children?: ReactNode;
  size?: "md" | "lg";
  className?: string;
}) => {
  const headingSize =
    size === "lg"
      ? "text-[1.875rem] leading-[1.1] sm:text-[2.5rem] sm:leading-[1.05]"
      : "text-[1.625rem] leading-[1.15] sm:text-[2rem] sm:leading-[1.1]";

  return (
    <div className={className}>
      {kicker && (
        <p
          className="animate-fade-up text-xs font-semibold uppercase tracking-[0.12em] text-muted"
          style={{ animationDelay: "40ms" }}
        >
          {kicker}
        </p>
      )}
      <h1
        className={`animate-fade-up text-balance font-bold tracking-tight text-content ${headingSize} ${
          kicker ? "mt-2.5" : ""
        }`}
        style={{ animationDelay: "80ms" }}
      >
        {title}
      </h1>
      <p
        className="animate-fade-up mt-3 text-pretty text-[15px] leading-relaxed text-muted sm:text-base"
        style={{ animationDelay: "140ms" }}
      >
        {lead}
      </p>
      {children && (
        <div
          className="animate-fade-up mt-5"
          style={{ animationDelay: "200ms" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};
