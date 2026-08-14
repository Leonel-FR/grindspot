import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 5 checkout attempts per minute per IP — enough for a real user retrying a
// typo'd email, tight enough to blunt enumeration/spam against Stripe.
export const checkoutRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "ratelimit:checkout",
});
