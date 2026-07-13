import { ChevronDownIcon } from "@heroicons/react/20/solid";
import type { FaqItem } from "~/lib/structured-data";

/**
 * FAQ list rendered as native <details> so answers are in the DOM (indexable,
 * works without JS). The same `items` feed the FAQPage JSON-LD on each page, so
 * the visible copy and the structured data never drift apart.
 */
export const Faq = ({
  items,
  title = "Pertanyaan yang sering ditanyakan",
}: {
  items: FaqItem[];
  title?: string;
}) => {
  return (
    <section className="mt-12" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-lg font-semibold tracking-tight text-content"
      >
        {title}
      </h2>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
        {items.map((item) => (
          <details key={item.q} className="group px-4 sm:px-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-medium text-content transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
              {item.q}
              <ChevronDownIcon
                className="h-4 w-4 shrink-0 text-faint transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
};
