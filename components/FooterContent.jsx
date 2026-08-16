"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

const REFUND_EMAIL = "leonelfr212@gmail.com";
const REFUND_SUBJECT = "Solicitud de reembolso - GrindSpot";
const REFUND_BODY = `Hola,

Quisiera solicitar un reembolso de mi compra de GrindSpot.

Email con el que pagué:
Fecha de compra:
Motivo (opcional):`;

const REFUND_MAILTO_HREF = `mailto:${REFUND_EMAIL}?subject=${encodeURIComponent(REFUND_SUBJECT)}&body=${encodeURIComponent(REFUND_BODY)}`;

// Split out of Footer (an async Server Component fetching `showRefundLink`
// from the DB) because the language preference only lives in client state —
// same reasoning as AuthButton/InlineAuthButton needing a client boundary
// for useSession.
export default function FooterContent({ showRefundLink }) {
  const { t } = useLanguage();

  return (
    <footer className="bg-white py-10">
      <div className="mx-auto max-w-345 px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="max-w-sm">
            <span className="text-xl font-black text-[#FF5A5F]">
              GrindSpot
            </span>
            <p className="mt-2 text-sm text-gray-500">
              {t("footer.tagline")}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-gray-600 sm:justify-start">
            <Link href="/faq" className="hover:text-[#FF5A5F]">
              {t("footer.faq")}
            </Link>
            <Link href="/terms" className="hover:text-[#FF5A5F]">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="hover:text-[#FF5A5F]">
              {t("footer.privacy")}
            </Link>
            <Link href="/cookies" className="hover:text-[#FF5A5F]">
              {t("footer.cookies")}
            </Link>
            {showRefundLink && (
              <a href={REFUND_MAILTO_HREF} className="hover:text-[#FF5A5F]">
                {t("footer.refund")}
              </a>
            )}
          </nav>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} GrindSpot
        </p>
      </div>
    </footer>
  );
}
