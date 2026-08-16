// app/auth/error/page.js
import AuthErrorContent from "@/components/AuthErrorContent";

export default async function AuthErrorPage({ searchParams }) {
  const { error } = await searchParams;

  const isAccessDenied = error === "AccessDenied";

  return <AuthErrorContent isAccessDenied={isAccessDenied} />;
}
