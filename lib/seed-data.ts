import type { Signal } from "./types";

/** Seed data: every workspace has multiple signals and mixed triage states.
 *  Company: Vela — a B2B SaaS workflow intelligence platform.
 *  Team: Jordan Lee (Partnerships & Legal), Alex Rivera (Design),
 *        Sam Okonkwo (Engineering), Taylor Chen (Revenue Operations).
 *  Customers: Meridian Health (enterprise), Foundry Collective (mid-market),
 *             Echo Foods (new vertical win), Stackwell / Lumen Studio (API partners).
 */
export const INITIAL_SIGNALS: Signal[] = [
  // ── Product ─────────────────────────────────────────────────────────────
  {
    id: "a1000000-0000-4000-8000-000000000030",
    title: "Mobile crash spike — iOS 17.4 cold start",
    why_it_matters:
      "5% of iOS sessions are failing on cold start after last week's release; affecting new-user activation and climbing in App Store reviews.",
    urgency: "critical",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "slack", label: "#incidents" },
      { type: "email", label: "crash-reports@vela.io" },
    ],
    related_inputs: [
      {
        snippet:
          "Sentry shows NullPointerException in Vela's BootstrapActivity.onCreate — only on iOS 17.4 with background refresh disabled.",
        from: "Engineering triage",
        at: "Apr 12",
      },
      {
        snippet: "Three 1-star App Store reviews in 48h mentioning 'crashes on open.'",
        from: "App Store monitor",
        at: "Apr 12",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000031",
    title: "Search relevance regression after last deploy",
    why_it_matters:
      "Power users are finding results from two releases ago ranking above current content; support volume up 12% this week.",
    urgency: "high",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "slack", label: "#search-feedback" },
      { type: "doc", label: "Search quality log (Notion)" },
    ],
    related_inputs: [
      {
        snippet:
          "Relevance score weighting changed in the 4/9 deploy — title boost was halved unintentionally.",
        from: "Engineering standup",
        at: "Apr 11",
      },
      {
        snippet:
          "Can we revert the ranking config without a full deploy? The feature flag is already in place.",
        from: "Slack #search-feedback",
        at: "Apr 11",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000032",
    title: "Onboarding drop-off up 18% this week",
    why_it_matters:
      "Week-2 retention is the key activation metric for Q2; an 18-point delta on a single step needs investigation before it compounds.",
    urgency: "high",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "email", label: "analytics@vela.io" },
      { type: "doc", label: "Activation dashboard" },
    ],
    related_inputs: [
      {
        snippet:
          "Drop is concentrated at the 'connect your calendar' step — completion rate went from 61% to 43%.",
        from: "Analytics weekly digest",
        at: "Apr 11",
      },
      {
        snippet:
          "Calendar permission prompt copy changed in the 4/7 release — likely cause.",
        from: "Release notes",
        at: "Apr 7",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000033",
    title: "Power users flagging new nav as harder to scan",
    why_it_matters:
      "Nav shipped two weeks ago; early adopter segment is the top churn risk if workflow disruption isn't addressed quickly.",
    urgency: "medium",
    suggested_owner: "Alex Rivera",
    assignee: "Alex Rivera",
    triage_state: "assigned",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "form", label: "NPS follow-up (Typeform)" },
      { type: "email", label: "success@vela.io" },
    ],
    related_inputs: [
      {
        snippet:
          "Seven responses in the last week mention 'can't find saved filters' or 'too many clicks to get to X.'",
        from: "NPS qualitative responses",
        at: "Apr 10",
      },
      {
        snippet:
          "One enterprise account (Meridian Health) asked if they can stay on old nav via feature flag.",
        from: "CS email",
        at: "Apr 9",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000034",
    title: "API rate limit complaints from Stackwell and Lumen Studio",
    why_it_matters:
      "Both integration partners are in expansion conversations; reliability concerns block upsell and risk the partnership.",
    urgency: "high",
    suggested_owner: "Sam Okonkwo",
    assignee: "Sam Okonkwo",
    triage_state: "assigned",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "email", label: "partners@vela.io" },
      { type: "slack", label: "#partner-escalations" },
    ],
    related_inputs: [
      {
        snippet:
          "Both partners are hitting the 429 limit on the /events endpoint during nightly syncs — burst limit too low for their batch size.",
        from: "Partner email thread",
        at: "Apr 10",
      },
      {
        snippet:
          "We could add a per-partner override flag; needs Sam + Jordan sign-off before we commit.",
        from: "Platform eng Slack",
        at: "Apr 11",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000001",
    title: "Meridian Health renewal blocked on legal review",
    why_it_matters:
      "Meridian is our largest enterprise renewal this quarter; legal delay risks churn and sets a precedent for other healthcare accounts.",
    urgency: "critical",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "legal",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "legal@meridianhealth.com" },
      { type: "calendar", label: "Exec sync · Thu 3pm" },
    ],
    related_inputs: [
      {
        snippet:
          "They can't countersign until our indemnity language is updated to reflect the new HIPAA data residency clause.",
        from: "Email thread",
        at: "Apr 9",
      },
      {
        snippet:
          "Renewal doc v3 is in the Legal shared drive — CRM still links to v2.",
        from: "Slack DM (forwarded)",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000026",
    title: "GDPR data subject request — 30-day response deadline Thursday",
    why_it_matters:
      "Regulatory deadline is non-negotiable; missing it opens Vela to formal complaint and fines under Article 77.",
    urgency: "high",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "legal",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "privacy@vela.io" },
      { type: "form", label: "DSR intake portal" },
    ],
    related_inputs: [
      {
        snippet:
          "Request covers all personal data held on the subject — export + deletion confirmation required within 30 days of Apr 3.",
        from: "Privacy inbox",
        at: "Apr 3",
      },
      {
        snippet:
          "Data engineering confirmed export is ready; legal sign-off needed before we send.",
        from: "Slack #privacy",
        at: "Apr 11",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    title: "Design debt: self-serve checkout flow inconsistencies",
    why_it_matters:
      "Support is seeing confused users at the payment step; small UX mismatches across the subscription flow are compounding into refund requests.",
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
          "The CTA label changes between steps 2 and 3 — feels like a different product mid-flow.",
        from: "Slack thread",
        at: "Apr 8",
      },
      {
        snippet: "Screenshot pack attached; mobile Safari is the worst case.",
        from: "Support ticket rollup",
        at: "Apr 7",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    title: "Foundry Collective: data export timing out before board prep",
    why_it_matters:
      "Foundry's ops team is building board materials and can't pull their full dataset; export failures are undermining trust right before our renewal conversation.",
    urgency: "critical",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "ops@foundrycollective.com" },
      { type: "slack", label: "#customer-escalations" },
    ],
    related_inputs: [
      {
        snippet:
          "CSV export spins for 10+ minutes then fails — only on accounts with more than 50k rows.",
        from: "Support email",
        at: "Apr 10",
      },
      {
        snippet: "They're fine with a staged export if we can commit to a ship date.",
        from: "Slack #customer-escalations",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    title: "Finance needs Q2 paid marketing commit by Friday",
    why_it_matters:
      "Budget lock is next week; without a number from Revenue Ops, two pipeline campaigns can't be booked in time.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "deferred",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "finance@vela.io" },
      { type: "form", label: "Budget intake (Typeform)" },
    ],
    related_inputs: [
      {
        snippet:
          "Need a single Q2 paid spend figure — even a range is OK for the initial lock.",
        from: "Email from Finance",
        at: "Apr 6",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    title: "Security patch for auth dependency (CVE-2024-3291)",
    why_it_matters:
      "CVE is medium severity but public; delaying the bump increases audit questions during Meridian Health's security review.",
    urgency: "high",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "product",
    signal_tag: "product",
    sources: [{ type: "email", label: "security-alerts@vela.io" }],
    related_inputs: [
      {
        snippet:
          "Recommended bump to 3.14.x — check breaking changes in the token refresh flow before shipping.",
        from: "Security bulletin",
        at: "Apr 9",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000027",
    title: "Slack workspace over seat limit — billing auto-paused new invites",
    why_it_matters:
      "Three pending contractor invites are blocked; IT and Engineering leads can't add people until the plan is upgraded or seats freed.",
    urgency: "high",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "operations",
    signal_tag: "product",
    sources: [
      { type: "email", label: "billing@slack.com" },
      { type: "slack", label: "#it-ops" },
    ],
    related_inputs: [
      {
        snippet:
          "We're at 247/250 seats — three invite links sent this week bounced with a billing gate error.",
        from: "IT Slack",
        at: "Apr 12",
      },
      {
        snippet:
          "Options: upgrade to the next tier ($420/mo delta) or audit inactive accounts — 15 flagged by IT as candidates.",
        from: "IT audit note",
        at: "Apr 12",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    title: "Team offsite dates — decision needed by EOW",
    why_it_matters:
      "Travel needs lead time; indecision is quietly burning admin hours on tentative holds and re-polling.",
    urgency: "low",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "ignored",
    workspace: "operations",
    signal_tag: "design",
    sources: [
      { type: "chat", label: "Slack · #people-ops" },
      { type: "calendar", label: "Holds (tentative)" },
    ],
    related_inputs: [
      {
        snippet:
          "Two viable weeks in May; vote closes Friday — currently 40% response rate from the team.",
        from: "Slack poll",
        at: "Apr 5",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    title: "v1 API deprecation — partner comms and timeline",
    why_it_matters:
      "Integration partners need migration runway; unclear communication will create surprise outages for Stackwell and Lumen Studio.",
    urgency: "high",
    suggested_owner: "Jordan Lee",
    assignee: "Jordan Lee",
    triage_state: "assigned",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "doc", label: "API changelog (Notion)" },
      { type: "email", label: "partners@vela.io" },
    ],
    related_inputs: [
      {
        snippet:
          "v1 endpoints sunset proposed for August — needs partner email draft, docs banner, and a migration guide.",
        from: "Engineering doc comment",
        at: "Apr 4",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    title: "Interview loop feedback scattered — offer at risk",
    why_it_matters:
      "Strong senior design candidate at risk of a slow decision; feedback is split across Greenhouse, Slack, and a shared doc.",
    urgency: "medium",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "operations",
    signal_tag: "product",
    sources: [
      { type: "email", label: "recruiting@vela.io" },
      { type: "calendar", label: "Debrief (rescheduled twice)" },
    ],
    related_inputs: [
      {
        snippet:
          "Greenhouse notes incomplete; two interviewers only left Slack reactions instead of structured feedback.",
        from: "Recruiting email",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000009",
    title: "Invoice mismatch on March cloud hosting",
    why_it_matters:
      "Small dollar amount but recurring; Finance wants a root-cause note before the Q1 audit closes.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "resolved",
    workspace: "operations",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "ap@vela.io" },
      { type: "form", label: "Vendor ticket portal" },
    ],
    related_inputs: [
      {
        snippet:
          "Usage line item doesn't match our internal dashboard by ~4% — likely tax region rounding in AWS billing.",
        from: "Finance email",
        at: "Apr 3",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000010",
    title: "Observability spike — batch job deploy correlation",
    why_it_matters:
      "No customer impact detected, but error budget burned faster than usual and the root cause isn't confirmed.",
    urgency: "low",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "deferred",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "slack", label: "#incidents" },
      { type: "doc", label: "Postmortem draft" },
    ],
    related_inputs: [
      {
        snippet:
          "Spike correlated with the 4/10 batch job deploy — needs an owner to confirm rollback plan before the next cycle.",
        from: "Standup notes",
        at: "Apr 11",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000011",
    title: "Docs request: legacy webhook payload examples",
    why_it_matters:
      "Stackwell's engineering team asked for v1 samples; unanswered requests from integration partners clutter the support queue.",
    urgency: "low",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "ignored",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "email", label: "engineering@stackwell.io" },
      { type: "doc", label: "Docs backlog" },
    ],
    related_inputs: [
      {
        snippet:
          "Can we point them to v2 samples only, or do we maintain both until the August sunset?",
        from: "Support triage",
        at: "Apr 2",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000012",
    title: "Staging feature flag leaked to internal demo environment",
    why_it_matters:
      "Already patched; closing the loop for triage hygiene and linking the postmortem.",
    urgency: "medium",
    suggested_owner: "Sam Okonkwo",
    assignee: null,
    triage_state: "resolved",
    workspace: "product",
    signal_tag: "product",
    sources: [
      { type: "slack", label: "#deploys" },
      { type: "email", label: "incidents@vela.io" },
    ],
    related_inputs: [
      {
        snippet: "Flag was default-on for 12 minutes; no production impact confirmed.",
        from: "Incident summary",
        at: "Apr 8",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000013",
    title: "Vendor NDA review — Pendo analytics integration",
    why_it_matters:
      "Procurement added Pendo to the roadmap; legal review is blocking the contract start and the integration kick-off.",
    urgency: "high",
    suggested_owner: "Jordan Lee",
    assignee: "Jordan Lee",
    triage_state: "assigned",
    workspace: "legal",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "procurement@vela.io" },
      { type: "form", label: "Vendor intake form" },
    ],
    related_inputs: [
      {
        snippet:
          "Standard NDA template — focus review on the data processing addendum given Pendo's event capture scope.",
        from: "Procurement",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000014",
    title: "Empty states audit — inconsistent across Settings screens",
    why_it_matters:
      "Inconsistent copy and illustration style is showing up in CSAT comments; 14 screens still use the old illustration pack.",
    urgency: "medium",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "design",
    signal_tag: "design",
    sources: [
      { type: "slack", label: "#design-system" },
      { type: "doc", label: "Empty states audit sheet" },
    ],
    related_inputs: [
      {
        snippet:
          "About 14 screens still use the old illustration pack — six of them are customer-facing Settings pages.",
        from: "Design QA",
        at: "Apr 9",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000015",
    title: "Renewal playbook refresh for mid-market segment",
    why_it_matters:
      "AEs are mixing enterprise talk tracks with mid-market deals; segment win rates have slipped 8 points this quarter.",
    urgency: "high",
    suggested_owner: "Taylor Chen",
    assignee: "Taylor Chen",
    triage_state: "assigned",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "sales-ops@vela.io" },
      { type: "doc", label: "Renewal playbook v4" },
    ],
    related_inputs: [
      {
        snippet:
          "Need one page per persona with tailored objection handling — Foundry Collective is a good reference account to build from.",
        from: "Sales leadership",
        at: "Apr 7",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000016",
    title: "Q2 vendor access review — three vendors overdue",
    why_it_matters:
      "SOC2 Type II cycle requires quarterly access attestations; three vendors are past the deadline and an auditor call is in two weeks.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "operations",
    signal_tag: "product",
    sources: [
      { type: "email", label: "security@vela.io" },
      { type: "form", label: "Access review checklist" },
    ],
    related_inputs: [
      {
        snippet:
          "Two former contractors are still listed on vendor portals — access needs to be revoked before the auditor review.",
        from: "Security checklist",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000017",
    title: "Data retention policy — comment period closes Thursday",
    why_it_matters:
      "Legal owes a published summary to the exec team; the comment window closes before the next exec review.",
    urgency: "medium",
    suggested_owner: "Jordan Lee",
    assignee: "Jordan Lee",
    triage_state: "assigned",
    workspace: "legal",
    signal_tag: "legal",
    sources: [
      { type: "email", label: "policy@vela.io" },
      { type: "doc", label: "Retention policy draft (PDF)" },
    ],
    related_inputs: [
      {
        snippet:
          "Stakeholders want a one-pager for the customer-facing help center alongside the internal policy doc.",
        from: "Compliance sync",
        at: "Apr 8",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000018",
    title: "Trademark cleared — Vela Pulse sub-brand approved",
    why_it_matters:
      "Marketing can proceed with launch assets for Vela Pulse; filing is logged for the audit trail.",
    urgency: "low",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "resolved",
    workspace: "legal",
    signal_tag: "legal",
    sources: [{ type: "email", label: "counsel@outsidecounsel.com" }],
    related_inputs: [
      {
        snippet:
          "No conflicting marks found in primary jurisdictions — Vela Pulse is clear to use.",
        from: "Outside counsel memo",
        at: "Apr 1",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000028",
    title: "Meridian Health expansion — champion leaving next month",
    why_it_matters:
      "Our main Meridian contact is departing; without a warm handoff, the expansion conversation stalls and the renewal relationship resets.",
    urgency: "high",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "needs_triage",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "champion@meridianhealth.com" },
      { type: "slack", label: "#account-meridian" },
    ],
    related_inputs: [
      {
        snippet:
          "Sarah confirmed her last day is May 2 — she offered to intro us to her successor but hasn't done it yet.",
        from: "Email thread",
        at: "Apr 11",
      },
      {
        snippet:
          "New stakeholder is in procurement, not operations — different priorities and no product context yet.",
        from: "Account Slack",
        at: "Apr 11",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000019",
    title: "Booth swag request — low-ACV prospect at regional fair",
    why_it_matters:
      "Request is from a non-strategic prospect; fulfilling it would burn swag budget without meaningful pipeline return.",
    urgency: "low",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "ignored",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "events@sponsor.io" },
      { type: "slack", label: "#field-events" },
    ],
    related_inputs: [
      {
        snippet: "They want 200 branded units shipped to a regional fair next month.",
        from: "Events inbox",
        at: "Mar 28",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000020",
    title: "Pilot closed — Echo Foods signed",
    why_it_matters:
      "First logo win in the food & beverage vertical; strong reference for similar accounts in the segment.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "resolved",
    workspace: "sales",
    signal_tag: "product",
    sources: [
      { type: "email", label: "ops@echofoodsco.com" },
      { type: "calendar", label: "Kickoff prep" },
    ],
    related_inputs: [
      {
        snippet:
          "Signed through procurement on Friday; kickoff scheduled for week of Apr 14.",
        from: "CRM note",
        at: "Apr 10",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000021",
    title: "Motion design backlog — onboarding screen transitions",
    why_it_matters:
      "Animation polish slipped past Q1 freeze; deferring to Q3 avoids blocking the current engineering sprint.",
    urgency: "low",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "deferred",
    workspace: "design",
    signal_tag: "design",
    sources: [
      { type: "slack", label: "#motion-design" },
      { type: "doc", label: "Motion specs (Figma)" },
    ],
    related_inputs: [
      {
        snippet:
          "Three onboarding screens still use linear transitions only — easing curves spec'd but not implemented.",
        from: "Design weekly review",
        at: "Apr 6",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000022",
    title: "Design system Figma library — contractor permissions fixed",
    why_it_matters:
      "Contractors now have read-only access; previous setup risked accidental library publishes.",
    urgency: "medium",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "resolved",
    workspace: "design",
    signal_tag: "design",
    sources: [
      { type: "email", label: "it-access@vela.io" },
      { type: "doc", label: "Access runbook" },
    ],
    related_inputs: [
      {
        snippet: "IT applied role templates for all external email domains — confirmed working.",
        from: "IT ticket #44821",
        at: "Apr 4",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000023",
    title: "Blog footer disclaimer references outdated 2019 privacy terms",
    why_it_matters:
      "Low risk but embarrassing if a customer or prospect finds it; not worth a sprint but should be queued.",
    urgency: "low",
    suggested_owner: "Jordan Lee",
    assignee: null,
    triage_state: "ignored",
    workspace: "legal",
    signal_tag: "legal",
    sources: [{ type: "email", label: "content@vela.io" }],
    related_inputs: [
      {
        snippet: "Footer link points to a retired PDF — current policy lives at vela.io/privacy.",
        from: "Content audit",
        at: "Mar 20",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000024",
    title: "Laptop refresh batch — vendor pushed ship dates 3 weeks",
    why_it_matters:
      "Hiring plan depends on device lead times; Q2 onboarding schedule may need to shift if hardware doesn't arrive.",
    urgency: "medium",
    suggested_owner: "Taylor Chen",
    assignee: null,
    triage_state: "deferred",
    workspace: "operations",
    signal_tag: "product",
    sources: [
      { type: "email", label: "procurement@vela.io" },
      { type: "chat", label: "Slack · #it-ops" },
    ],
    related_inputs: [
      {
        snippet: "CDW pushed MacBook ship dates by 3 weeks — affects the May new-hire cohort.",
        from: "Procurement",
        at: "Apr 9",
      },
    ],
  },
  {
    id: "a1000000-0000-4000-8000-000000000025",
    title: "Illustration pack for internal admin tools (nice-to-have)",
    why_it_matters:
      "Internal-only screens; deprioritized behind customer-facing work until Q3 design cycle.",
    urgency: "low",
    suggested_owner: "Alex Rivera",
    assignee: null,
    triage_state: "ignored",
    workspace: "design",
    signal_tag: "design",
    sources: [{ type: "slack", label: "#design-lounge" }],
    related_inputs: [
      {
        snippet:
          "Could reuse the marketing illustration set with a crop — worth revisiting when customer-facing work settles.",
        from: "Slack thread",
        at: "Mar 15",
      },
    ],
  },
];
