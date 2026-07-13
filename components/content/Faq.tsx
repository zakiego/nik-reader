import { PlusIcon } from "@heroicons/react/20/solid";
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
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-balance text-lg font-semibold tracking-tight text-content sm:text-xl"
      >
        {title}
      </h2>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        {items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[15px] font-medium text-content transition-colors duration-150 ease-out hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:px-5 [&::-webkit-details-marker]:hidden">
              {item.q}
              <PlusIcon
                className="h-4 w-4 shrink-0 text-faint transition-transform duration-200 ease-out group-open:rotate-45"
                aria-hidden="true"
              />
            </summary>
            <p className="max-w-[62ch] px-4 pb-4 text-sm leading-relaxed text-muted sm:px-5">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};
