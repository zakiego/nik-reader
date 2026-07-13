import type { ReactNode } from "react";

/**
 * Page hero holding the single <h1> and a short lead paragraph. Keeping the h1
 * here (not inside the tool) gives every page one clear, keyword-led heading.
 */
export const PageHero = ({
  title,
  lead,
  className = "mt-8",
}: {
  title: string;
  lead: ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold tracking-tight text-content sm:text-[1.75rem]">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{lead}</p>
    </div>
  );
};
