import { NextResponse } from "next/server";

/** Extension + local web can call license APIs. */
export function withCors(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export function corsPreflight(): NextResponse {
  return withCors(new NextResponse(null, { status: 204 }));
}

export function jsonCors(data: unknown, status = 200): NextResponse {
  return withCors(NextResponse.json(data, { status }));
}
