import { NextResponse } from "next/server";
import { getPremiumUser } from "@/lib/access";
import { getSpotCoordinates } from "@/lib/spots";
import { spotsMapRatelimit } from "@/lib/ratelimit";

export async function GET() {
  const user = await getPremiumUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { success } = await spotsMapRatelimit.limit(String(user.id));
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const coordinates = await getSpotCoordinates();
  return NextResponse.json(coordinates);
}
