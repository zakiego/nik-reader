import type { ReactNode } from "react";

/**
 * A titled content block with an <h2>. Used for the explanatory prose that gives
 * search engines something substantial to index beyond the interactive tool.
 */
export const ContentSection = ({
  id,
  title,
  children,
  className = "mt-12",
}: {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <section className={className} aria-labelledby={id}>
      <h2 id={id} className="text-lg font-semibold tracking-tight text-content">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
};
