import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import { hasAccessByEmail } from "@/lib/access";
import { checkoutRatelimit } from "@/lib/ratelimit";

export async function POST(req) {
  try {
    const headersList = await headers();

    // x-forwarded-for can carry a proxy chain ("client, proxy1, proxy2");
    // the first entry is the original client.
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      headersList.get("x-real-ip") ??
      "unknown";

    const { success } = await checkoutRatelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a minute." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    // Guard against paying twice: the UI hides the CTAs for users who already
    // have access, but a stale page or a direct call could still get here.
    if (await hasAccessByEmail(email)) {
      return NextResponse.json(
        { error: "You already have access to GrindSpot." },
        { status: 409 }
      );
    }

    const origin = headersList.get("origin");

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
