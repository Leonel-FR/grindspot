import "server-only";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

// Tokens are single-use and expire a few minutes after the widget issues
// them, so this call always reflects a live decision from Cloudflare.
export async function verifyTurnstileToken(token, ip) {
  if (!token) return false;

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  });
  if (ip && ip !== "unknown") body.append("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
