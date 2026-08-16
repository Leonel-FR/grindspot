import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import FAQContent from "@/components/FAQContent";
import en from "@/lib/i18n/dictionaries/en";

export const metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about GrindSpot: how spots are verified, premium access, pricing, and refunds.",
  alternates: {
    canonical: "/faq",
  },
};

// Structured data has no client-side language toggle to read, so it's
// sourced straight from the English dictionary — same default every other
// server-rendered/SEO surface on the site uses (see LanguageProvider).
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: en.faq.items.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PageHeader />
      <FAQContent />
      <Footer />
    </main>
  );
}
