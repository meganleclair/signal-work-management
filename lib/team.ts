export const TEAM_NAMES = [
  "Alex Rivera",
  "Jordan Lee",
  "Sam Okonkwo",
  "Taylor Chen",
  "Morgan Patel",
] as const;

export type TeamName = (typeof TEAM_NAMES)[number];

/** Mutable copy for runtime array methods that accept `string`. */
export const TEAM: string[] = [...TEAM_NAMES];
