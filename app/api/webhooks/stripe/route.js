import Stripe from "stripe";
import sql from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email?.toLowerCase().trim();

    if (email && session.payment_status === "paid") {
      const [user] = await sql`
        INSERT INTO users (email, stripe_customer_id, has_access)
        VALUES (${email}, ${session.customer}, true)
        ON CONFLICT (email)
        DO UPDATE SET has_access = true, stripe_customer_id = ${session.customer}, updated_at = now()
        RETURNING id
      `;

      await sql`
        INSERT INTO payments (user_id, stripe_checkout_session_id, stripe_payment_intent_id, amount, currency, status)
        VALUES (${user.id}, ${session.id}, ${session.payment_intent}, ${session.amount_total}, ${session.currency}, 'paid')
        ON CONFLICT (stripe_checkout_session_id) DO NOTHING
      `;
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;

    const [payment] = await sql`
      UPDATE payments SET status = 'refunded', refunded_at = now()
      WHERE stripe_payment_intent_id = ${charge.payment_intent}
      RETURNING user_id
    `;

    if (payment) {
      await sql`UPDATE users SET has_access = false WHERE id = ${payment.userId}`;
    }
  }

  return new Response(null, { status: 200 });
}
