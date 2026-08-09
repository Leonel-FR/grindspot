import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import sql from "@/lib/db";

/**
 * Resolves the signed-in user only if they still have premium access.
 *
 * Access is read from the database on every request instead of the session:
 * the JWT outlives access changes (a refund flips `has_access` but the cookie
 * stays valid until it expires), so the token alone can't be trusted to gate
 * premium features.
 */
export const getPremiumUser = cache(async () => {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase().trim();
  if (!email) return null;

  const [user] = await sql`
    SELECT id, has_access FROM users WHERE email = ${email}
  `;

  return user?.hasAccess ? { id: user.id } : null;
});

export async function getLikedSpotIds(userId) {
  const rows = await sql`
    SELECT spot_id FROM spot_likes WHERE user_id = ${userId}
  `;

  return rows.map((row) => row.spotId);
}
