import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { track } from "~/lib/analytics";
import type { FaqItem } from "~/lib/structured-data";

/**
 * FAQ accordion. Answers are force-mounted, so every one is in the server HTML
 * (indexable) even while collapsed. The same `items` feed the FAQPage JSON-LD on
 * each page, so the visible copy and the structured data never drift apart.
 */
export const Faq = ({
  items,
  title = "Pertanyaan yang sering ditanyakan",
}: {
  items: FaqItem[];
  title?: string;
}) => {
  const open = useRef<string[]>([]);

  return (
    <section className="mt-16" aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="text-balance text-xl font-semibold tracking-[-0.015em] sm:text-[1.375rem]"
      >
        {title}
      </h2>
      <Accordion
        type="multiple"
        className="mt-4 border-t"
        onValueChange={(next) => {
          for (const question of next) {
            if (!open.current.includes(question)) {
              track("faq-open", { question });
            }
          }
          open.current = next;
        }}
      >
        {items.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent forceMount>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
