import { NextResponse } from "next/server";
import { getPremiumUser } from "@/lib/access";
import { getSpotById } from "@/lib/spots";

export async function GET(request, { params }) {
  const user = await getPremiumUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { id } = await params;
  const spot = await getSpotById(id);

  if (!spot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(spot);
}
