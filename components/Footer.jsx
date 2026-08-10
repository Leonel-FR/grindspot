import Link from "next/link";
import { canRequestRefund } from "@/lib/access";

const REFUND_EMAIL = "leonelfr212@gmail.com";
const REFUND_SUBJECT = "Solicitud de reembolso - GrindSpot";
const REFUND_BODY = `Hola,

Quisiera solicitar un reembolso de mi compra de GrindSpot.

Email con el que pagué:
Fecha de compra:
Motivo (opcional):`;

const REFUND_MAILTO_HREF = `mailto:${REFUND_EMAIL}?subject=${encodeURIComponent(REFUND_SUBJECT)}&body=${encodeURIComponent(REFUND_BODY)}`;

export default async function Footer() {
  const showRefundLink = await canRequestRefund();

  return (
    <footer className="bg-white py-10">
      <div className="mx-auto max-w-345 px-6">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="max-w-sm">
            <span className="text-xl font-black text-[#FF5A5F]">
              GrindSpot
            </span>
            <p className="mt-2 text-sm text-gray-500">
              Find your next remote work spot, verified before you go.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-bold text-gray-600 sm:justify-start">
            <Link href="/faq" className="hover:text-[#FF5A5F]">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-[#FF5A5F]">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#FF5A5F]">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-[#FF5A5F]">
              Cookie Policy
            </Link>
            {showRefundLink && (
              <a
                href={REFUND_MAILTO_HREF}
                className="hover:text-[#FF5A5F]"
              >
                Request a Refund
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
