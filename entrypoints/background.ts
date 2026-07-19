import { recordVisit, loadDesktopState, saveDesktopState } from "../lib/storage";
import { toMainDomain, displayName, faviconUrl, siteUrl } from "../lib/domain";
import type { SiteEntry } from "../lib/types";
import { heuristicFill } from "../lib/fill-engine";
import { aiFill } from "../lib/ai-fill";
import { API_BASE } from "../lib/config";
import {
  loadProfile,
  loadSettings,
  profileCompleteness,
  profileForServer,
} from "../lib/profile";
import { isPro, loadLicense } from "../lib/license";
import type {
  FillRequest,
  FillResponse,
  ProfileStatusRequest,
  ProfileStatusResponse,
} from "../lib/messages";
import { t } from "../lib/i18n";

export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async (details) => {
    await seedFromHistory();
    if (details.reason === "install") {
      chrome.runtime.openOptionsPage();
    }
  });

  chrome.history.onVisited.addListener((item) => {
    if (!item.url) return;
    void recordVisit(item.url, item.title);
  });

  chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !tab.url) return;
    void recordVisit(tab.url, tab.title);
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "OPEN_OPTIONS") {
      chrome.runtime.openOptionsPage();
      sendResponse({ ok: true });
      return false;
    }
    void handleMessage(message).then(sendResponse);
    return true;
  });
});

async function handleMessage(
  message: FillRequest | ProfileStatusRequest,
): Promise<FillResponse | ProfileStatusResponse> {
  if (message.type === "PROFILE_STATUS") {
    const profile = await loadProfile();
    const completeness = profileCompleteness(profile);
    return {
      completeness,
      hasBasics: Boolean(profile.email?.trim() || profile.fullName?.trim()),
    };
  }

  if (message.type === "AUTO_FILL") {
    return runAutoFill(message);
  }

  return {
    ok: false,
    map: {},
    mode: "heuristic",
    filled: 0,
    error: "Unknown message",
  };
}

async function runAutoFill(message: FillRequest): Promise<FillResponse> {
  const profile = await loadProfile();
  const settings = await loadSettings();
  const completeness = profileCompleteness(profile);
  const pro = await isPro();

  if (completeness === 0) {
    return {
      ok: false,
      map: {},
      mode: "heuristic",
      filled: 0,
      needsProfile: true,
      error: t("background.profileRequired"),
    };
  }

  let map = heuristicFill(message.fields, profile);
  let mode: FillResponse["mode"] = "heuristic";

  // Pro: server AI fill (no card data sent)
  if (pro) {
    try {
      const license = await loadLicense();
      const res = await fetch(`${API_BASE}/v1/fill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: license.key,
          instanceId: license.instanceId,
          fields: message.fields,
          profile: profileForServer(profile),
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        map?: Record<string, string>;
        mode?: string;
        error?: string;
      };
      if (res.ok && data.map && Object.keys(data.map).length > 0) {
        map = { ...map, ...data.map };
        mode = "ai";
      } else if (data.error) {
        console.warn("[Ranasi] server fill:", data.error);
      }
    } catch (err) {
      console.warn("[Ranasi] server fill failed, heuristic only", err);
    }
  } else if (settings.useAiFill && settings.openaiApiKey.trim()) {
    // Free advanced: optional user-owned OpenAI key
    try {
      const aiMap = await aiFill(
        message.fields,
        profile,
        settings.openaiApiKey,
      );
      map = { ...map, ...aiMap };
      mode = Object.keys(aiMap).length ? "mixed" : "heuristic";
      if (Object.keys(aiMap).length >= Object.keys(map).length) mode = "ai";
    } catch (err) {
      console.warn("[Ranasi] AI fill failed, using heuristic", err);
    }
  }

  return {
    ok: Object.keys(map).length > 0,
    map,
    mode,
    filled: Object.keys(map).length,
    error:
      Object.keys(map).length === 0
        ? pro
          ? t("background.noMatch")
          : t("background.noMatchFree")
        : undefined,
  };
}

async function seedFromHistory(): Promise<void> {
  const state = await loadDesktopState();
  if (state.sites.length > 0) return;

  const items = await chrome.history.search({
    text: "",
    maxResults: 400,
    startTime: Date.now() - 1000 * 60 * 60 * 24 * 90,
  });

  const byDomain = new Map<string, SiteEntry>();

  for (const item of items) {
    if (!item.url) continue;
    const domain = toMainDomain(item.url);
    if (!domain || domain === "localhost") continue;

    const existing = byDomain.get(domain);
    const count = item.visitCount ?? 1;
    const last = item.lastVisitTime ?? Date.now();

    if (existing) {
      existing.visitCount += count;
      existing.lastVisited = Math.max(existing.lastVisited, last);
      if (item.title) existing.title = displayName(domain, item.title);
    } else {
      byDomain.set(domain, {
        id: domain,
        domain,
        path: "/",
        title: displayName(domain, item.title),
        url: siteUrl(domain),
        favicon: faviconUrl(domain),
        visitCount: count,
        lastVisited: last,
        pinned: false,
        order: byDomain.size,
        hidden: false,
      });
    }
  }

  const sites = [...byDomain.values()]
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 40)
    .map((s, i) => ({ ...s, order: i }));

  await saveDesktopState({ ...state, sites });
}
