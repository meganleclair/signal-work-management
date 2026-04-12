import type { Signal } from "./types";

/** Seed data: every workspace has multiple signals and mixed triage states. */
export const INITIAL_SIGNALS: Signal[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    title: "Enterprise renewal blocked on legal review",
    why_it_matters:
      "ACME’s renewal is the largest in the quarter; legal delay risks churn and sets precedent for other enterprise deals.",
    urgency: "critical",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "legal",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "legal@acme.com" },
      { type: "calendar", label: "Exec sync · Thu 3pm" },
    ],
    related_inputs: [
      {
        snippet:
          "We can’t countersign until indemnity language is updated for the new data residency clause.",
        from: "Email thread",
        at: "Apr 9",
      },
      {
        snippet: "Renewal doc v3 is in the Legal shared drive — still showing v2 link in CRM.",
        from: "Slack DM (forwarded)",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    title: "Design debt: checkout flow inconsistencies",
    why_it_matters:
      "Support is seeing confused users at payment; small UX mismatches are compounding into refunds.",
    urgency: "high",
    suggested_owner: "Alex Rivera",
    assignee: "Alex Rivera",
    triage_state: "assigned",
    workspace: "design",
    signal_tag: "design",
    sources: [
      { type: "slack", label: "#product-design" },
      { type: "doc", label: "Checkout audit (Notion)" },
    ],
    related_inputs: [
      {
        snippet:
          "The CTA label changes between steps 2→3 — feels like a different product.",
        from: "Slack thread",
        at: "Apr 8",
      },
      {
        snippet: "Screenshot pack attached; mobile Safari worst case.",
        from: "Support ticket rollup",
        at: "Apr 7",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    title: "Customer escalation: exports timing out",
    why_it_matters:
      "Strategic customer preparing board materials; export failures undermine trust before renewal.",
    urgency: "critical",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "success@northwind.io" },
      { type: "slack", label: "#customer-escalations" },
    ],
    related_inputs: [
      {
        snippet:
          "CSV export spins for 10+ minutes then fails — happens on accounts >50k rows.",
        from: "Email",
        at: "Apr 10",
      },
      {
        snippet: "They’re fine with a staged export if we can commit to a date.",
        from: "Slack",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    title: "Finance asking for Q2 marketing commit",
    why_it_matters:
      "Budget lock is next week; without a number, two campaigns can’t be booked.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "deferred",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "finance@company.com" },
      { type: "form", label: "Budget intake (Typeform)" },
    ],
    related_inputs: [
      {
        snippet:
          "Need a single Q2 paid spend figure — even a range is OK for now.",
        from: "Email",
        at: "Apr 6",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    title: "Security patch window for auth dependency",
    why_it_matters:
      "CVE is medium severity but public; delaying increases audit questions.",
    urgency: "high",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "product",
    signal_tag: "product",
    sources: [{ type: "email", label: "security-alerts@internal" }],
    related_inputs: [
      {
        snippet:
          "Recommended bump to 3.14.x — check breaking changes in token refresh.",
        from: "Security bulletin",
        at: "Apr 9",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    title: "Team offsite dates — decision needed",
    why_it_matters:
      "Travel needs lead time; indecision is quietly burning admin hours on holds.",
    urgency: "low",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "ignored",
    workspace: "operations",
    signal_tag: "design",
    sources: [
      { type: "chat", label: "Teams · People Ops" },
      { type: "calendar", label: "Holds (tentative)" },
    ],
    related_inputs: [
      {
        snippet:
          "Two viable weeks in May; vote closes Friday — currently 40% response rate.",
        from: "Chat poll",
        at: "Apr 5",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    title: "Public API deprecation timeline",
    why_it_matters:
      "Partners need migration runway; unclear comms will create surprise outages.",
    urgency: "high",
    suggested_owner: "Jordan Lee",
    assignee: "Jordan Lee",
    triage_state: "assigned",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "doc", label: "API changelog" },
      { type: "email", label: "partners@list" },
    ],
    related_inputs: [
      {
        snippet:
          "v1 endpoints sunset proposed for August — needs partner email + docs banner.",
        from: "Engineering doc comment",
        at: "Apr 4",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    title: "Interview loop feedback scattered",
    why_it_matters:
      "Strong candidate at risk of slow decision; feedback lives in three places.",
    urgency: "medium",
    suggested_owner: "Alex Rivera",
    assignee: "Alex Rivera",
    triage_state: "assigned",
    workspace: "operations",
    signal_tag: "product",
    sources: [
      { type: "email", label: "recruiting@company.com" },
      { type: "calendar", label: "Debrief (moved twice)" },
    ],
    related_inputs: [
      {
        snippet:
          "Greenhouse notes incomplete; two interviewers only left Slack reactions.",
        from: "Recruiting email",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000009",
    title: "Invoice mismatch on March hosting",
    why_it_matters:
      "Small dollar amount but recurring; finance wants a root-cause note for audit.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "resolved",
    workspace: "operations",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "ap@company.com" },
      { type: "form", label: "Vendor ticket portal" },
    ],
    related_inputs: [
      {
        snippet:
          "Usage line item doesn’t match internal dashboard by ~4% — likely tax region rounding.",
        from: "Finance email",
        at: "Apr 3",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000010",
    title: "Parking lot: observability spike last night",
    why_it_matters:
      "No customer impact detected, but error budget burned faster than usual.",
    urgency: "low",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "deferred",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "slack", label: "#incidents" },
      { type: "doc", label: "Postmort draft" },
    ],
    related_inputs: [
      {
        snippet:
          "Spike correlated with batch job deploy — needs owner to confirm rollback plan.",
        from: "Standup notes",
        at: "Apr 11",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000011",
    title: "Docs request: legacy webhook examples",
    why_it_matters:
      "Partner engineering asked for samples; low priority but clutters support queue when unanswered.",
    urgency: "low",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "ignored",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "email", label: "partners@engineering" },
      { type: "doc", label: "Docs backlog" },
    ],
    related_inputs: [
      {
        snippet: "Can we point them to v2 samples only or maintain both?",
        from: "Support triage",
        at: "Apr 2",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000012",
    title: "Staging feature flag leaked to internal demo",
    why_it_matters:
      "Already patched; closing the loop for triage hygiene and postmort link.",
    urgency: "medium",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "resolved",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "slack", label: "#deploys" },
      { type: "email", label: "incident@internal" },
    ],
    related_inputs: [
      {
        snippet: "Flag default-on for 12 minutes; no prod impact.",
        from: "Incident summary",
        at: "Apr 8",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000013",
    title: "Vendor NDA turnaround — 48h",
    why_it_matters:
      "Procurement added a new analytics vendor; legal review blocks contract start.",
    urgency: "high",
    suggested_owner: "Jordan Lee",
    assignee: "Jordan Lee",
    triage_state: "assigned",
    workspace: "legal",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "procurement@co" },
      { type: "form", label: "Vendor intake" },
    ],
    related_inputs: [
      {
        snippet: "Standard NDA template — check data processing addendum only.",
        from: "Procurement",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000014",
    title: "Empty states audit across settings",
    why_it_matters:
      "Inconsistent copy and illustration style is showing up in CSAT comments.",
    urgency: "medium",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "design",
    signal_tag: "design",
    sources: [
      { type: "slack", label: "#design-system" },
      { type: "doc", label: "Audit sheet" },
    ],
    related_inputs: [
      {
        snippet: "About 14 screens still use the old illustration pack.",
        from: "Design QA",
        at: "Apr 9",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000015",
    title: "Renewal playbook refresh for mid-market",
    why_it_matters:
      "AEs mixing enterprise talk tracks with mid-market deals; win rates slipping in segment.",
    urgency: "high",
    suggested_owner: "Taylor Chen",
    assignee: "Taylor Chen",
    triage_state: "assigned",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "sales-ops@co" },
      { type: "doc", label: "Playbook v4" },
    ],
    related_inputs: [
      {
        snippet: "Need one page per persona with objection handling.",
        from: "Sales leadership",
        at: "Apr 7",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000016",
    title: "Vendor access review — Q2",
    why_it_matters:
      "SOC2 cycle requires quarterly access attestations; three vendors overdue.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "operations",
    signal_tag: "product",
    sources: [
      { type: "email", label: "security@co" },
      { type: "form", label: "Access review" },
    ],
    related_inputs: [
      {
        snippet: "Two former contractors still listed on vendor portals.",
        from: "Security checklist",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000017",
    title: "Data retention policy comment period",
    why_it_matters:
      "Legal owes a published summary; comment window closes before exec review.",
    urgency: "medium",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "deferred",
    workspace: "legal",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "policy@co" },
      { type: "doc", label: "Draft PDF" },
    ],
    related_inputs: [
      {
        snippet: "Stakeholders want a one-pager for customer-facing help center.",
        from: "Compliance sync",
        at: "Apr 8",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000018",
    title: "Trademark search cleared for new sub-brand",
    why_it_matters:
      "Marketing can proceed with launch assets; filing logged for audit trail.",
    urgency: "low",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "resolved",
    workspace: "legal",
    signal_tag: "legal",
    sources: [{ type: "email", label: "counsel@firm.com" }],
    related_inputs: [
      {
        snippet: "No conflicting marks in primary jurisdictions.",
        from: "Outside counsel memo",
        at: "Apr 1",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000019",
    title: "Booth giveaway request (non-strategic account)",
    why_it_matters:
      "Low ACV prospect; ops asked to decline politely to protect margin on swag budget.",
    urgency: "low",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "ignored",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "events@partner.io" },
      { type: "slack", label: "#field-events" },
    ],
    related_inputs: [
      {
        snippet: "They want 200 units shipped to a regional fair.",
        from: "Events inbox",
        at: "Mar 28",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000020",
    title: "Pilot closed — Echo Foods",
    why_it_matters:
      "First logo win in new vertical; good reference for similar accounts.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "resolved",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "echo-foods@cfo.com" },
      { type: "calendar", label: "QBR" },
    ],
    related_inputs: [
      {
        snippet: "Signed through procurement Friday; kickoff week of Apr 14.",
        from: "CRM note",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000021",
    title: "Motion study backlog for onboarding screens",
    why_it_matters:
      "Animation polish slipped past Q1; deferring avoids blocking eng freeze.",
    urgency: "low",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "deferred",
    workspace: "design",
    signal_tag: "design",
    sources: [
      { type: "slack", label: "#motion" },
      { type: "doc", label: "Motion specs" },
    ],
    related_inputs: [
      {
        snippet: "Three screens still use linear transitions only.",
        from: "Design weekly",
        at: "Apr 6",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000022",
    title: "Design system Figma library permissions",
    why_it_matters:
      "Contractors need read-only; current setup risks accidental publishes.",
    urgency: "medium",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "resolved",
    workspace: "design",
    signal_tag: "design",
    sources: [
      { type: "email", label: "it-access@co" },
      { type: "doc", label: "Access runbook" },
    ],
    related_inputs: [
      {
        snippet: "IT applied role templates for external emails.",
        from: "Ticket #44821",
        at: "Apr 4",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000023",
    title: "Old blog disclaimer still references 2019 privacy terms",
    why_it_matters:
      "Low risk but embarrassing if a customer digs; not worth a full sprint.",
    urgency: "low",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "ignored",
    workspace: "legal",
    signal_tag: "legal",
    sources: [{ type: "email", label: "content@co" }],
    related_inputs: [
      {
        snippet: "Footer link points to retired PDF.",
        from: "Content audit",
        at: "Mar 20",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000024",
    title: "Laptop refresh batch — procurement quote delay",
    why_it_matters:
      "Hiring plan depends on device lead times; defer until next budget cycle.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "deferred",
    workspace: "operations",
    signal_tag: "product",
    sources: [
      { type: "email", label: "procurement@co" },
      { type: "chat", label: "IT chat" },
    ],
    related_inputs: [
      {
        snippet: "Vendor pushed ship dates by 3 weeks.",
        from: "Procurement",
        at: "Apr 9",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000025",
    title: "Illustration pack for internal tools (nice-to-have)",
    why_it_matters:
      "Internal-only screens; deprioritized behind customer-facing work.",
    urgency: "low",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "ignored",
    workspace: "design",
    signal_tag: "design",
    sources: [{ type: "slack", label: "#design-random" }],
    related_inputs: [
      {
        snippet: "Could reuse marketing illustrations with a crop.",
        from: "Slack thread",
        at: "Mar 15",
      },
    ],
  },
];
