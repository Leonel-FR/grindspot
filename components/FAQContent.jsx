"use client";

import { useLanguage } from "@/components/LanguageProvider";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/Accordion";

// Split out of the FAQ page (a Server Component exporting `metadata` and
// the English-only JSON-LD) because the language preference only lives in
// client state — same reasoning as Footer/FooterContent.
export default function FAQContent() {
  const { t } = useLanguage();
  const faqs = t("faq.items");

  return (
    <>
      <section className="px-6 py-16 text-center md:py-24">
        <h1 className="text-4xl leading-none font-black tracking-[-0.4px] text-gray-900 md:text-5xl">
          {t("faq.title")}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-500">
          {t("faq.subtitle")}
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Accordion className="flex flex-col gap-4" defaultValue={0}>
          {faqs.map((faq, index) => (
            <AccordionPanel key={faq.question} value={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p>{faq.answer}</p>
              </AccordionContent>
            </AccordionPanel>
          ))}
        </Accordion>
      </section>
    </>
  );
}
