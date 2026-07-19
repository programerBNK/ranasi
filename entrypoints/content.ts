import type { FormFieldSnapshot } from "../lib/fill-engine";
import type { FillResponse } from "../lib/messages";
import { t } from "../lib/i18n";

const ROOT_ID = "autoflow-fill-root";
const BTN_ID = "autoflow-fill-btn";

export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  runAt: "document_idle",
  main() {
    injectStyles();
    mountFab();

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        if (!document.getElementById(ROOT_ID) && hasFillableFields()) {
          mountFab();
        }
      });
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  },
});

function injectStyles() {
  if (document.getElementById("autoflow-style")) return;
  const style = document.createElement("style");
  style.id = "autoflow-style";
  style.textContent = `
    #${ROOT_ID} {
      all: initial;
      position: fixed !important;
      right: 18px !important;
      bottom: 18px !important;
      z-index: 2147483646 !important;
      font-family: Figtree, system-ui, sans-serif !important;
    }
    #${BTN_ID} {
      all: initial;
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      padding: 12px 16px !important;
      border-radius: 999px !important;
      background: #12363a !important;
      color: #f2f7f5 !important;
      font: 600 13px/1 Figtree, system-ui, sans-serif !important;
      cursor: pointer !important;
      box-shadow: 0 12px 32px rgba(0,0,0,.28) !important;
      border: 1px solid rgba(94,234,212,.45) !important;
      transition: transform .15s ease, background .15s ease !important;
    }
    #${BTN_ID}:hover {
      transform: translateY(-2px) !important;
      background: #1b4f4a !important;
    }
    #${BTN_ID}[data-busy="1"] {
      opacity: .7 !important;
      pointer-events: none !important;
    }
    #${BTN_ID} .af-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #5eead4; display: inline-block;
    }
    #autoflow-toast {
      all: initial;
      position: fixed !important;
      right: 18px !important;
      bottom: 68px !important;
      z-index: 2147483647 !important;
      background: rgba(12,24,26,.94) !important;
      color: #f2f7f5 !important;
      font: 600 12px/1.4 Figtree, system-ui, sans-serif !important;
      padding: 10px 14px !important;
      border-radius: 12px !important;
      border: 1px solid rgba(255,255,255,.12) !important;
      max-width: 260px !important;
      box-shadow: 0 12px 28px rgba(0,0,0,.3) !important;
    }
  `;
  document.documentElement.appendChild(style);
}

function mountFab() {
  if (document.getElementById(ROOT_ID)) return;
  if (!hasFillableFields()) return;

  const root = document.createElement("div");
  root.id = ROOT_ID;

  const btn = document.createElement("button");
  btn.id = BTN_ID;
  btn.type = "button";
  btn.innerHTML = `<span class="af-dot"></span><span>${t("content.button")}</span>`;
  btn.addEventListener("click", () => void onFillClick(btn));

  root.appendChild(btn);
  document.documentElement.appendChild(root);
}

function hasFillableFields(): boolean {
  return collectFields().length >= 1;
}

function collectFields(): { el: HTMLInputElement | HTMLTextAreaElement; snap: FormFieldSnapshot }[] {
  const nodes = [
    ...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=image]), textarea",
    ),
  ];

  const out: { el: HTMLInputElement | HTMLTextAreaElement; snap: FormFieldSnapshot }[] = [];

  nodes.forEach((el, index) => {
    if (!isVisible(el) || el.disabled || el.readOnly) return;
    const uid = el.dataset.autoflowUid || `af_${index}_${el.name || el.id || "f"}`;
    el.dataset.autoflowUid = uid;

    out.push({
      el,
      snap: {
        uid,
        tag: el.tagName.toLowerCase(),
        type: (el.getAttribute("type") || "text").toLowerCase(),
        name: el.getAttribute("name") || "",
        id: el.id || "",
        autocomplete: el.getAttribute("autocomplete") || "",
        placeholder: el.getAttribute("placeholder") || "",
        label: findLabelText(el),
        ariaLabel: el.getAttribute("aria-label") || "",
      },
    });
  });

  return out;
}

function findLabelText(el: Element): string {
  const id = el.getAttribute("id");
  if (id) {
    const byFor = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (byFor?.textContent) return byFor.textContent.trim();
  }
  const parentLabel = el.closest("label");
  if (parentLabel?.textContent) return parentLabel.textContent.trim();

  const prev = el.previousElementSibling;
  if (prev && /label|span|p|div/i.test(prev.tagName) && (prev.textContent?.length ?? 0) < 80) {
    return prev.textContent?.trim() || "";
  }
  return "";
}

function isVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;
  const style = window.getComputedStyle(el);
  if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") {
    return false;
  }
  return true;
}

async function onFillClick(btn: HTMLButtonElement) {
  const collected = collectFields();
  if (collected.length === 0) {
    toast(t("content.noFields"));
    return;
  }

  btn.dataset.busy = "1";
  const label = btn.querySelector("span:last-child");
  if (label) label.textContent = "Filling…";

  try {
    const response = (await chrome.runtime.sendMessage({
      type: "AUTO_FILL",
      fields: collected.map((c) => c.snap),
    })) as FillResponse;

    if (response.needsProfile) {
      toast(response.error || t("content.profileRequired"));
      chrome.runtime.sendMessage({ type: "OPEN_OPTIONS" });
      return;
    }

    if (!response.ok) {
      toast(response.error || t("content.failed"));
      return;
    }

    let n = 0;
    for (const { el, snap } of collected) {
      const value = response.map[snap.uid];
      if (value == null) continue;
      setNativeValue(el, value);
      n++;
    }

    toast(t("content.success", { count: n, mode: response.mode }));
  } catch (err) {
    toast(err instanceof Error ? err.message : t("content.error"));
  } finally {
    btn.dataset.busy = "0";
    if (label) label.textContent = t("content.button");
  }
}

function setNativeValue(
  el: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, "value");
  desc?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

function toast(text: string) {
  document.getElementById("autoflow-toast")?.remove();
  const el = document.createElement("div");
  el.id = "autoflow-toast";
  el.textContent = text;
  document.documentElement.appendChild(el);
  window.setTimeout(() => el.remove(), 3200);
}
