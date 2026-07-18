import type { FormFieldSnapshot, FillMap } from "./fill-engine";
import { profileToPromptBlock } from "./fill-engine";
import type { UserProfile } from "./profile";

/**
 * Ask OpenAI to map form fields → profile values.
 * Falls back silently if key missing / request fails (caller uses heuristic).
 */
export async function aiFill(
  fields: FormFieldSnapshot[],
  profile: UserProfile,
  apiKey: string,
): Promise<FillMap> {
  if (!apiKey.trim()) return {};

  const compact = fields.map((f) => ({
    uid: f.uid,
    type: f.type,
    name: f.name,
    id: f.id,
    label: f.label || f.ariaLabel || f.placeholder,
    autocomplete: f.autocomplete,
  }));

  const system = `You fill web forms from a user profile.
Return ONLY valid JSON object: { "<uid>": "<value>", ... }
Rules:
- Use only values from the profile (or obvious combinations like full name).
- Skip fields you are unsure about.
- Never invent emails, phones, or card data not in the profile.
- Prefer empty over wrong.`;

  const user = `PROFILE:\n${profileToPromptBlock(profile)}\n\nFIELDS:\n${JSON.stringify(compact)}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as FillMap;

  // Only allow known uids + non-empty strings
  const allowed = new Set(fields.map((f) => f.uid));
  const out: FillMap = {};
  for (const [uid, value] of Object.entries(parsed)) {
    if (!allowed.has(uid)) continue;
    if (typeof value !== "string" || !value.trim()) continue;
    out[uid] = value;
  }
  return out;
}
