import { NextResponse } from "next/server";
import crypto from "node:crypto";

/**
 * Lemon Squeezy webhook — logs events.
 * License keys are emailed by Lemon Squeezy; no DB required in v1.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (secret) {
    const signature = request.headers.get("x-signature") || "";
    const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    if (signature !== digest) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  try {
    const payload = JSON.parse(raw) as {
      meta?: { event_name?: string };
      data?: { id?: string };
    };
    console.log(
      "[lemonsqueezy webhook]",
      payload.meta?.event_name,
      payload.data?.id,
    );
  } catch {
    console.log("[lemonsqueezy webhook] non-json body received");
  }

  return NextResponse.json({ ok: true });
}
