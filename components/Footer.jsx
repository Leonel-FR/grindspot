import { canRequestRefund } from "@/lib/access";
import FooterContent from "@/components/FooterContent";

export default async function Footer() {
  const showRefundLink = await canRequestRefund();

  return <FooterContent showRefundLink={showRefundLink} />;
}
