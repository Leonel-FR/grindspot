import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// 5 checkout attempts per minute per IP — enough for a real user retrying a
// typo'd email, tight enough to blunt enumeration/spam against Stripe.
export const checkoutRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "ratelimit:checkout",
});

// Both of these gate authenticated per-user actions, so they're keyed by
// user id rather than IP. Generous on purpose — this only needs to stop a
// scripted loop, not a real person browsing quickly.
export const spotDetailRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "ratelimit:spot-detail",
});

export const likeRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  prefix: "ratelimit:like",
});

export const spotsMapRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "60 s"),
  prefix: "ratelimit:spots-map",
});
