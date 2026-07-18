import { NextRequest } from "next/server";
import { corsPreflight, jsonCors } from "@/lib/cors";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3130").replace(
  /\/$/,
  "",
);

export async function OPTIONS() {
  return corsPreflight();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const res = await fetch(`${API}/v1/license/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await res.json();
    return jsonCors(data, res.status);
  } catch {
    return jsonCors(
      { valid: false, error: `Axum API unreachable at ${API}` },
      502,
    );
  }
}
