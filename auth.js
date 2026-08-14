import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import sql from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    error: "/auth/error",
  },
  // Auth.js only auto-trusts the Host header on Vercel/Cloudflare Pages (or
  // in dev). Any other host — `next start` locally, Railway, a VPS, etc. —
  // needs this explicitly, or every request 500s with UntrustedHost. Safe as
  // long as the platform in front of the app (its reverse proxy/load
  // balancer) sets Host/X-Forwarded-Host itself rather than passing through
  // whatever the client sent.
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase().trim();

      const [dbUser] = await sql`
        SELECT id, has_access, name, image FROM users WHERE email = ${email}
      `;

      if (!dbUser || !dbUser.hasAccess) {
        return false;
      }

      if (!dbUser.name || !dbUser.image) {
        await sql`
          UPDATE users SET name = ${user.name}, image = ${user.image} WHERE id = ${dbUser.id}
        `;
      }

      return true;
    },
  },
});
