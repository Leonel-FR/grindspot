import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

import { stripe } from "@/lib/stripe";
import { hasAccessByEmail } from "@/lib/access";
import { checkoutRatelimit } from "@/lib/ratelimit";
import { verifyTurnstileToken } from "@/lib/turnstile";

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
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const { email, turnstileToken } = await req.json();

    if (!(await verifyTurnstileToken(turnstileToken, ip))) {
      return NextResponse.json(
        { error: "verification_failed" },
        { status: 403 }
      );
    }

    const origin = headersList.get("origin");

    // Guard against paying twice: the UI hides the CTAs for users who already
    // have access, but a stale page or a direct call could still get here.
    // Responds with the same 200 { url } shape as a real checkout instead of
    // a distinct error, so the endpoint can't be used to enumerate which
    // emails are paying customers — it just sends them somewhere else.
    if (await hasAccessByEmail(email)) {
      return NextResponse.json({ url: `${origin}/welcome-back` });
    }

    // DataFast attributes this payment back to a marketing channel by
    // matching these against the visitor/session it tracked client-side.
    // Cookies are absent if the datafa.st script hasn't run yet (blocked,
    // or a direct API call), so metadata is only set when present.
    const cookieStore = await cookies();
    const visitorId = cookieStore.get("datafast_visitor_id")?.value;
    const sessionId = cookieStore.get("datafast_session_id")?.value;
    const metadata = {
      ...(visitorId && { datafast_visitor_id: visitorId }),
      ...(sessionId && { datafast_session_id: sessionId }),
    };

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
      metadata,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // err.message may come straight from Stripe (English only, and not meant
    // for end users) — logged here for debugging, but the client only ever
    // sees a translated generic error, never this raw text.
    console.error(err);
    return NextResponse.json(
      { error: "checkout_failed" },
      { status: err.statusCode || 500 }
    );
  }
}
