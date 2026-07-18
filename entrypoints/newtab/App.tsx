import { useCallback, useEffect, useMemo, useState } from "react";
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
import { STORAGE_KEY, type DesktopState, type SiteEntry, type ThemeId } from "../../lib/types";
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
import { AddTile, SiteTile } from "./components/SiteTile";
import { ContextMenu } from "./components/ContextMenu";
import { AddSiteModal } from "./components/AddSiteModal";

const THEMES: { id: ThemeId; label: string; pro?: boolean }[] = [
  { id: "mint-night", label: "Mint" },
  { id: "slate-dawn", label: "Slate" },
  { id: "ember-glass", label: "Ember", pro: true },
];

export function App() {
  const [state, setState] = useState<DesktopState | null>(null);
  const [license, setLicense] = useState<LicenseState | null>(null);
  const [profilePct, setProfilePct] = useState(100);
  const [now, setNow] = useState(() => new Date());
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    site: SiteEntry;
  } | null>(null);

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

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(null), 2800);
  }

  async function onThemeClick(themeId: ThemeId, requiresPro?: boolean) {
    if (requiresPro && !pro) {
      showToast(`Ember theme is Pro — ${PRO_PRICE_LABEL}`);
      return;
    }
    setState(await setTheme(themeId));
  }

  async function onExportProfile() {
    if (!pro) {
      showToast(`Export profile is Pro — ${PRO_PRICE_LABEL}`);
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
    a.download = "autoflow-desktop.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported desktop layout");
  }

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const sites = useMemo(() => (state ? visibleSites(state) : []), [state]);
  const ids = useMemo(() => sites.map((s) => s.id), [sites]);

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
    // Optimistic UI
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
      <div className="desktop" data-theme="mint-night">
        <div className="desktop__atmosphere" />
      </div>
    );
  }

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="desktop" data-theme={state.theme}>
      <div className="desktop__atmosphere" />
      {state.wallpaper && (
        <div
          className="desktop__wallpaper"
          style={{ backgroundImage: `url(${state.wallpaper})` }}
        />
      )}

      <header className="desktop__top">
        <div className="brand">
          <h1 className="brand__name">AutoFlow</h1>
          <p className="brand__tag">
            Desktop ของคุณ — เว็บหลักที่เคยเข้า ปักหมุด ลากจัดเรียง ลบได้ทันที
          </p>
          {profilePct < 50 && (
            <button
              type="button"
              className="chip"
              style={{ marginTop: 12 }}
              onClick={() => chrome.runtime.openOptionsPage()}
            >
              ตั้งค่า Profile ครั้งเดียว → เริ่ม Auto-Fill
            </button>
          )}
        </div>

        <div className="clock">
          <div className="clock__time">{time}</div>
          <div className="clock__date">{date}</div>
          <div className="toolbar" style={{ marginTop: 14 }}>
            <button
              type="button"
              className="chip"
              data-active={pro}
              onClick={() => {
                if (pro) chrome.runtime.openOptionsPage();
                else window.open(CHECKOUT_URL, "_blank");
              }}
              title={pro ? "Manage license" : `Upgrade — ${PRO_PRICE_LABEL}`}
            >
              {pro ? "Pro" : "Free → Pro"}
            </button>
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className="chip"
                data-active={state.theme === t.id}
                onClick={() => onThemeClick(t.id, t.pro)}
                title={
                  t.pro && !pro
                    ? `Pro theme — ${PRO_PRICE_LABEL}`
                    : t.label
                }
              >
                {t.label}
                {t.pro && !pro ? " ·" : ""}
              </button>
            ))}
            <button
              type="button"
              className="chip"
              onClick={onExportProfile}
              title={pro ? "Export layout" : "Pro feature"}
            >
              Export
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Add website"
              onClick={() => setShowAdd(true)}
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
            ท่องเว็บตามปกติ แล้วกลับมาที่แท็บใหม่ — หรือกด + เพื่อเพิ่มเอง
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
                <AddTile onClick={() => setShowAdd(true)} />
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
            setState(await addCustomSite(domain));
          }}
        />
      )}

      {toast && (
        <div
          className="chip"
          style={{
            position: "fixed",
            left: "50%",
            bottom: 28,
            transform: "translateX(-50%)",
            zIndex: 60,
            pointerEvents: "none",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
