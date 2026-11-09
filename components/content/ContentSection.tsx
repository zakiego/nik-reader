import type { ReactNode } from "react";

/**
 * A titled content block with an <h2>. Holds the explanatory prose that gives
 * search engines something substantial to index beyond the interactive tool.
 * Lists, links and emphasis inside it are styled here, so pages write plain
 * markup.
 */
export const ContentSection = ({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) => (
  <section className="mt-16" aria-labelledby={id}>
    <h2
      id={id}
      className="text-balance text-xl font-semibold tracking-[-0.015em] sm:text-[1.375rem]"
    >
      {title}
    </h2>
    <div className="mt-4 flex max-w-[65ch] flex-col gap-4 text-base leading-7 text-foreground/80 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-4 hover:[&_a]:decoration-primary [&_li]:pl-1 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-6 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-6 marker:text-muted-foreground">
      {children}
    </div>
  </section>
);
