"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/components/LanguageProvider";

const CONTACT_EMAIL = "leonelfr212@gmail.com";

const REFUND_SUBJECT = "Solicitud de reembolso - GrindSpot";
const REFUND_BODY = `Hola,

Quisiera solicitar un reembolso de mi compra de GrindSpot.

Email con el que pagué:
Fecha de compra:
Motivo (opcional):`;

const REFUND_MAILTO_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(REFUND_SUBJECT)}&body=${encodeURIComponent(REFUND_BODY)}`;

const SUGGEST_SUBJECT = "Sugerencia de nuevo spot - GrindSpot";

// The account email is pre-filled (instead of a blank field like the
// refund template) since we already have it client-side via the session,
// and it's how we match the suggestion back to who sent it.
function buildSuggestMailtoHref(email) {
  const body = `Hola,

Quisiera sugerir un nuevo lugar para GrindSpot.

Mi correo de GrindSpot: ${email ?? ""}
Link de Google Maps del lugar: `;

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(SUGGEST_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

// Split out of Footer (an async Server Component fetching `showRefundLink`
// and `hasAccess` from the DB) because the language preference and the
// signed-in email only live in client state — same reasoning as
// AuthButton/InlineAuthButton needing a client boundary for useSession.
export default function FooterContent({ showRefundLink, hasAccess }) {
  const { t } = useLanguage();
  const { data: session } = useSession();

  return (
    <footer className="bg-[#fbfaf8] py-10">
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
            <Link href="/faq" className="cursor-pointer hover:text-[#FF5A5F]">
              {t("footer.faq")}
            </Link>
            <Link href="/terms" className="cursor-pointer hover:text-[#FF5A5F]">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="cursor-pointer hover:text-[#FF5A5F]">
              {t("footer.privacy")}
            </Link>
            <Link href="/cookies" className="cursor-pointer hover:text-[#FF5A5F]">
              {t("footer.cookies")}
            </Link>
            {hasAccess && (
              <a
                href={buildSuggestMailtoHref(session?.user?.email)}
                className="cursor-pointer hover:text-[#FF5A5F]"
              >
                {t("footer.suggestSpot")}
              </a>
            )}
            {showRefundLink && (
              <a href={REFUND_MAILTO_HREF} className="cursor-pointer hover:text-[#FF5A5F]">
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
