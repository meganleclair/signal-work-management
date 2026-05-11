import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.SIGNAL_ANTHROPIC_KEY ?? "";
  return NextResponse.json({
    key_set: key.length > 0,
    key_length: key.length,
    key_prefix: key.slice(0, 14) || "(empty)",
  });
}
