import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import sql from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    error: "/auth/error",
  },
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
