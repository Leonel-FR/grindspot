import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function LegalPage({ title, lastUpdated, children }) {
  return (
    <main>
      <PageHeader />

      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl leading-none font-black tracking-[-0.4px] text-gray-900 md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm font-bold text-gray-500">
            Last Updated: {lastUpdated}
          </p>

          <div
            className="prose prose-gray mt-10 max-w-none
              prose-headings:font-black prose-headings:tracking-[-0.2px] prose-headings:text-gray-900
              prose-h2:mt-12 prose-h2:text-2xl prose-h2:first:mt-0
              prose-h3:text-lg
              prose-p:leading-relaxed prose-p:text-gray-600
              prose-a:font-bold prose-a:text-[#FF5A5F] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-800
              prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#FF5A5F] prose-code:before:content-none prose-code:after:content-none
              prose-li:text-gray-600
              prose-hr:my-10 prose-hr:border-gray-200
              prose-table:text-sm
              prose-thead:border-gray-300
              prose-th:text-gray-900
              prose-td:text-gray-600"
          >
            {children}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
