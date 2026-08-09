import { NextResponse } from "next/server";
import { auth } from "@/auth"; // ajusta el import según cómo exportas tu `auth` helper
import sql from "@/lib/db";

export async function POST(request, { params }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: spotId } = await params;

  const [user] =
    await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await sql`
    INSERT INTO spot_likes (user_id, spot_id) VALUES (${user.id}, ${spotId})
    ON CONFLICT DO NOTHING
  `;

  return NextResponse.json({ liked: true });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id: spotId } = await params;

  const [user] =
    await sql`SELECT id FROM users WHERE email = ${session.user.email}`;
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await sql`DELETE FROM spot_likes WHERE user_id = ${user.id} AND spot_id = ${spotId}`;

  return NextResponse.json({ liked: false });
}
