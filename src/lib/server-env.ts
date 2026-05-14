import "server-only";

export function requireOpenRouterKey() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }
  return key;
}
