import { NextResponse } from "next/server";
import { getPremiumUser } from "@/lib/access";
import { getSpotById } from "@/lib/spots";
import { spotDetailRatelimit } from "@/lib/ratelimit";

export async function GET(request, { params }) {
  const user = await getPremiumUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { success } = await spotDetailRatelimit.limit(String(user.id));
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const { id } = await params;
  const spot = await getSpotById(id);

  if (!spot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(spot);
}
