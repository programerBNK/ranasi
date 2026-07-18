import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  PRO_DEFAULT_THEME,
  STORAGE_KEY,
  type DesktopState,
  type SiteEntry,
  type ThemeId,
} from "../../lib/types";
import {
  addCustomSite,
  loadDesktopState,
  removeSite,
  reorderSites,
  setPinned,
  setTheme,
  visibleSites,
} from "../../lib/storage";
import { CHECKOUT_URL, PRO_PRICE_LABEL } from "../../lib/config";
import {
  FREE_SITE_LIMIT,
  countVisibleSites,
  effectiveTheme,
} from "../../lib/entitlements";
import {
  ensureFreshLicense,
  isProActive,
  LICENSE_STORAGE_KEY,
  type LicenseState,
} from "../../lib/license";
import {
  loadProfile,
  PROFILE_STORAGE_KEY,
  profileCompleteness,
} from "../../lib/profile";
import { ALL_THEMES } from "../../lib/themes";
import { AddTile, SiteTile } from "./components/SiteTile";
import { ContextMenu } from "./components/ContextMenu";
import { AddSiteModal } from "./components/AddSiteModal";
import { ThemePicker } from "./components/ThemePicker";

export function App() {
  const [state, setState] = useState<DesktopState | null>(null);
  const [license, setLicense] = useState<LicenseState | null>(null);
  const [profilePct, setProfilePct] = useState(100);
  const [now, setNow] = useState(() => new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    site: SiteEntry;
  } | null>(null);
  const wasProRef = useRef<boolean | null>(null);

  const pro = license ? isProActive(license) : false;

  const refresh = useCallback(async () => {
    setState(await loadDesktopState());
  }, []);

  useEffect(() => {
    void refresh();
    void ensureFreshLicense().then(setLicense);
    void loadProfile().then((p) => setProfilePct(profileCompleteness(p)));
    const onStorage = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string,
    ) => {
      if (area !== "local") return;
      if (changes[STORAGE_KEY]) void refresh();
      if (changes[LICENSE_STORAGE_KEY]) void ensureFreshLicense().then(setLicense);
      if (changes[PROFILE_STORAGE_KEY]) {
        void loadProfile().then((p) => setProfilePct(profileCompleteness(p)));
      }
    };
    chrome.storage.onChanged.addListener(onStorage);
    return () => chrome.storage.onChanged.removeListener(onStorage);
  }, [refresh]);

  // Free → Pro: apply Noir Gold default once
  useEffect(() => {
    if (license === null || !state) return;
    if (wasProRef.current === false && pro) {
      void setTheme(PRO_DEFAULT_THEME).then(setState);
      setToast("Welcome to Pro — Noir Gold");
      window.setTimeout(() => setToast(null), 2800);
    }
    wasProRef.current = pro;
  }, [pro, license, state]);

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 2800);
  }

  async function onThemeClick(themeId: ThemeId, requiresPro?: boolean) {
    if (requiresPro && !pro) {
      showToast(`ธีมนี้เป็น Pro — ${PRO_PRICE_LABEL}`);
      window.open(CHECKOUT_URL, "_blank");
      return;
    }
    setState(await setTheme(themeId));
    setShowThemes(false);
  }

  async function onExportProfile() {
    if (!pro) {
      showToast(`Export เป็น Pro — ${PRO_PRICE_LABEL}`);
      chrome.runtime.openOptionsPage();
      return;
    }
    if (!state) return;
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ranasi-desktop.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported desktop layout");
  }

  function tryOpenAdd() {
    if (!state) return;
    if (!pro && countVisibleSites(state) >= FREE_SITE_LIMIT) {
      showToast(`ฟรีเพิ่มได้ ${FREE_SITE_LIMIT} เว็บ — Pro ไม่จำกัด`);
      window.open(CHECKOUT_URL, "_blank");
      return;
    }
    setShowAdd(true);
  }

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const sites = useMemo(() => (state ? visibleSites(state) : []), [state]);
  const ids = useMemo(() => sites.map((s) => s.id), [sites]);
  const visibleCount = state ? countVisibleSites(state) : 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(sites, oldIndex, newIndex);
    setState((prev) => {
      if (!prev) return prev;
      const orderMap = new Map(next.map((s, i) => [s.id, i]));
      return {
        ...prev,
        sites: prev.sites.map((s) =>
          orderMap.has(s.id) ? { ...s, order: orderMap.get(s.id)! } : s,
        ),
      };
    });
    setState(await reorderSites(next.map((s) => s.id)));
  }

  function openSite(site: SiteEntry) {
    window.location.href = site.url;
  }

  if (!state) {
    return (
      <div className="desktop" data-theme="noir-gold" data-pro="true">
        <div className="desktop__atmosphere" />
      </div>
    );
  }

  const theme = effectiveTheme(state.theme, pro);
  const themeLabel =
    ALL_THEMES.find((t) => t.id === theme)?.label ?? "Theme";

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="desktop" data-theme={theme} data-pro={pro}>
      <div className="desktop__atmosphere" />
      {state.wallpaper && (
        <div
          className="desktop__wallpaper"
          style={{ backgroundImage: `url(${state.wallpaper})` }}
        />
      )}

      <header className="desktop__top">
        <div className="brand">
          <p className="brand__eyebrow">
            {pro ? "Pro Desktop" : "Ranasi Desktop"}
          </p>
          <h1 className="brand__name">Ranasi</h1>
          <p className="brand__tag">
            {pro
              ? "12 ธีมพรีเมียม · เพิ่มเว็บได้ไม่จำกัด · ดูลึก มีมิติ"
              : `ฟรี: ธีม Mint/Slate · เพิ่มเว็บได้ ${FREE_SITE_LIMIT} รายการ`}
          </p>
          {profilePct < 50 && (
            <button
              type="button"
              className="chip"
              style={{ marginTop: 10 }}
              onClick={() => chrome.runtime.openOptionsPage()}
            >
              ตั้งค่า Profile → เริ่ม Auto-Fill
            </button>
          )}
        </div>

        <div className="clock">
          <div className="clock__time">{time}</div>
          <div className="clock__date">{date}</div>
          <div className="meta-line">
            {pro
              ? `${visibleCount} เว็บ · ไม่จำกัด`
              : `${visibleCount}/${FREE_SITE_LIMIT} เว็บ`}
          </div>
          <div className="toolbar">
            <button
              type="button"
              className="chip chip--pro"
              data-active={pro}
              onClick={() => {
                if (pro) chrome.runtime.openOptionsPage();
                else window.open(CHECKOUT_URL, "_blank");
              }}
            >
              {pro ? "Pro" : "Free → Pro"}
            </button>

            <button
              type="button"
              className="chip"
              data-active={showThemes}
              onClick={() => setShowThemes((v) => !v)}
              title="Themes"
            >
              {themeLabel}
            </button>

            <ThemePicker
              open={showThemes}
              current={theme}
              pro={pro}
              onClose={() => setShowThemes(false)}
              onSelect={onThemeClick}
            />

            <button type="button" className="chip" onClick={onExportProfile}>
              Export
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Add website"
              onClick={tryOpenAdd}
            >
              +
            </button>
          </div>
        </div>
      </header>

      <div className="desktop__grid-wrap">
        {sites.length === 0 ? (
          <div className="empty">
            <strong>ยังไม่มีเว็บบน Desktop</strong>
            กด + เพื่อเพิ่ม
            {!pro && ` · ฟรีได้สูงสุด ${FREE_SITE_LIMIT} เว็บ`}
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={ids} strategy={rectSortingStrategy}>
              <div className="site-grid">
                {sites.map((site) => (
                  <SiteTile
                    key={site.id}
                    site={site}
                    onOpen={openSite}
                    onContextMenu={(e, s) => {
                      e.preventDefault();
                      setMenu({ x: e.clientX, y: e.clientY, site: s });
                    }}
                  />
                ))}
                <AddTile onClick={tryOpenAdd} />
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          site={menu.site}
          onClose={() => setMenu(null)}
          onOpen={() => {
            openSite(menu.site);
            setMenu(null);
          }}
          onPin={async () => {
            setState(await setPinned(menu.site.id, !menu.site.pinned));
            setMenu(null);
          }}
          onRemove={async () => {
            setState(await removeSite(menu.site.id));
            setMenu(null);
          }}
        />
      )}

      {showAdd && (
        <AddSiteModal
          onClose={() => setShowAdd(false)}
          onAdd={async (domain) => {
            try {
              setState(await addCustomSite(domain));
            } catch (err) {
              if (err instanceof Error && err.message === "SITE_LIMIT") {
                showToast(`ฟรีเพิ่มได้ ${FREE_SITE_LIMIT} เว็บ — Pro ไม่จำกัด`);
                window.open(CHECKOUT_URL, "_blank");
                return;
              }
              throw err;
            }
          }}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
