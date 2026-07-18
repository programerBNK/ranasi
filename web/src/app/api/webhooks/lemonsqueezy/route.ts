import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Deprecated endpoint. Send Lemon Squeezy webhooks to the Ranasi Axum API at /v1/webhooks/lemonsqueezy.",
    },
    { status: 410 },
  );
}
