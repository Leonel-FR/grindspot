import { canRequestRefund, getPremiumUser } from "@/lib/access";
import FooterContent from "@/components/FooterContent";

export default async function Footer() {
  // getPremiumUser is cache()-wrapped, so canRequestRefund's own internal
  // call reuses this result instead of hitting the DB a second time.
  const user = await getPremiumUser();
  const showRefundLink = await canRequestRefund();

  return (
    <FooterContent hasAccess={Boolean(user)} showRefundLink={showRefundLink} />
  );
}
