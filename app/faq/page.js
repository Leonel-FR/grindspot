"use client";

import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/Accordion";

const faqs = [
  {
    question: "What is GrindSpot?",
    answer:
      "GrindSpot helps remote workers and freelancers find great places to work from — cafes, co-working spaces, and libraries — all verified for wifi quality, noise level, and how work-friendly they actually are before you show up.",
  },
  {
    question: "How do you verify a spot is actually good for working?",
    answer:
      "Every spot on GrindSpot is rated on wifi speed, noise level, outlet availability, and overall work-friendliness, based on real visits and reviews, so you're not guessing whether a place is actually suited for a focused work session.",
  },
  {
    question: "What do I get with a premium account?",
    answer:
      "Premium unlocks full access to every verified spot on the map, detailed ratings and stats for each location, and the ability to save your favorite spots so you can find them again in one click.",
  },
  {
    question: "How much does GrindSpot cost?",
    answer:
      "GrindSpot is a one-time payment that unlocks lifetime access to the platform — no recurring subscription, no hidden fees. You pay once and every spot, current and future, is unlocked for good.",
  },
  {
    question: "Can I suggest a new work spot to add to the map?",
    answer:
      "Yes! We're always looking to grow our list of verified spots. Reach out through our contact email with the spot's name and location, and our team will visit and verify it before adding it to the platform.",
  },
  {
    question: "How do I manage or get a refund on my purchase?",
    answer:
      "You can manage your billing details anytime from your account settings. If something isn't right with your purchase, contact our support team and we'll be happy to help sort it out.",
  },
];

export default function FAQPage() {
  return (
    <main>
      <PageHeader />

      <section className="px-6 py-16 text-center md:py-24">
        <h1 className="text-4xl leading-none font-black tracking-[-0.4px] text-gray-900 md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-gray-500">
          Everything you need to know about GrindSpot. Can&apos;t find what
          you&apos;re looking for? Reach out to our support team.
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

      <Footer />
    </main>
  );
}
