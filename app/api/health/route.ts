import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.SIGNAL_ANTHROPIC_KEY ?? "";

  // Test Anthropic directly with raw fetch so we see exactly what Netlify gets back.
  let anthropicStatus: number | null = null;
  let anthropicBody = "";
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 5,
        messages: [{ role: "user", content: "hi" }],
      }),
    });
    anthropicStatus = res.status;
    anthropicBody = await res.text();
  } catch (e) {
    anthropicBody = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    key_set: key.length > 0,
    key_length: key.length,
    key_prefix: key.slice(0, 18) || "(empty)",
    anthropic_status: anthropicStatus,
    anthropic_body: anthropicBody.slice(0, 400),
  });
}
