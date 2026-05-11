import { NextResponse } from "next/server";
import { TEAM_NAMES, type TeamName } from "@/lib/team";
import type { Signal, Urgency } from "@/lib/types";

export interface TriageAssistResult {
  urgency: Urgency;
  suggested_owner: TeamName;
  recommended_action: string;
}

function isUrgency(v: unknown): v is Urgency {
  return v === "critical" || v === "high" || v === "medium" || v === "low";
}

function isTeamName(v: unknown): v is TeamName {
  return TEAM_NAMES.includes(v as TeamName);
}

export async function POST(req: Request) {
  const apiKey = process.env.SIGNAL_ANTHROPIC_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "SIGNAL_ANTHROPIC_KEY is not configured." },
      { status: 503 }
    );
  }

  let signal: Signal;
  try {
    const body = (await req.json()) as { signal: Signal };
    signal = body.signal;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const sourcesText = signal.sources
    .map((s) => `${s.type}: ${s.label}`)
    .join(", ");

  const inputsText = signal.related_inputs
    .map(
      (r) =>
        `- "${r.snippet}" (${r.from}${r.at ? `, ${r.at}` : ""})`
    )
    .join("\n");

  const userMessage = `Signal to triage:
Title: ${signal.title}
Current urgency: ${signal.urgency}
Workspace: ${signal.workspace}
Why it matters: ${signal.why_it_matters}
Sources: ${sourcesText || "None"}
Related context:
${inputsText || "None"}`;

  const SYSTEM_PROMPT = `You are a triage assistant for Signal, a work management tool used by Vela (a B2B SaaS workflow intelligence company). Analyze incoming signals and recommend how to act on them.

Team roles:
- Alex Rivera: Design Lead — UX, design system, onboarding flows
- Jordan Lee: Head of Partnerships & Legal — contracts, compliance, API partner communication
- Sam Okonkwo: Engineering Lead — infrastructure, mobile, incidents, security, search
- Taylor Chen: Head of Revenue Operations — sales playbooks, procurement, vendor management
- Morgan Patel: Product Manager — product strategy, roadmap priorities

Respond ONLY with a valid JSON object. No markdown, no explanation, just raw JSON:
{"urgency":"critical"|"high"|"medium"|"low","suggested_owner":"Alex Rivera"|"Jordan Lee"|"Sam Okonkwo"|"Taylor Chen"|"Morgan Patel","recommended_action":"2 concise sentences on the single most important first action the owner should take"}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "(no body)");
      throw new Error(`Anthropic ${res.status}: ${errText}`);
    }

    const data = (await res.json()) as {
      content: Array<{ type: string; text: string }>;
    };
    const raw = data.content[0]?.type === "text" ? data.content[0].text.trim() : "";

    // Strip markdown code fences if Claude wraps the response.
    const text = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    const parsed = JSON.parse(text) as {
      urgency: unknown;
      suggested_owner: unknown;
      recommended_action: unknown;
    };

    if (
      !isUrgency(parsed.urgency) ||
      !isTeamName(parsed.suggested_owner) ||
      typeof parsed.recommended_action !== "string"
    ) {
      throw new Error("Unexpected shape in Claude response.");
    }

    const result: TriageAssistResult = {
      urgency: parsed.urgency,
      suggested_owner: parsed.suggested_owner,
      recommended_action: parsed.recommended_action,
    };

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
