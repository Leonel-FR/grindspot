import { NextResponse } from "next/server";
import { getPremiumUser } from "@/lib/access";
import sql from "@/lib/db";
import { likeRatelimit } from "@/lib/ratelimit";

export async function POST(request, { params }) {
  const user = await getPremiumUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { success } = await likeRatelimit.limit(String(user.id));
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const { id: spotId } = await params;

  await sql`
    INSERT INTO spot_likes (user_id, spot_id) VALUES (${user.id}, ${spotId})
    ON CONFLICT DO NOTHING
  `;

  return NextResponse.json({ liked: true });
}

export async function DELETE(request, { params }) {
  const user = await getPremiumUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { success } = await likeRatelimit.limit(String(user.id));
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const { id: spotId } = await params;

  await sql`DELETE FROM spot_likes WHERE user_id = ${user.id} AND spot_id = ${spotId}`;

  return NextResponse.json({ liked: false });
}
