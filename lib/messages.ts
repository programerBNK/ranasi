import type { FormFieldSnapshot, FillMap } from "./fill-engine";

export type FillRequest = {
  type: "AUTO_FILL";
  fields: FormFieldSnapshot[];
};

export type FillResponse = {
  ok: boolean;
  map: FillMap;
  mode: "heuristic" | "ai" | "mixed";
  filled: number;
  error?: string;
  needsProfile?: boolean;
};

export type ProfileStatusRequest = { type: "PROFILE_STATUS" };
export type ProfileStatusResponse = {
  completeness: number;
  hasBasics: boolean;
};
