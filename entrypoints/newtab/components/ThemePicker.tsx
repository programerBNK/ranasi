import { useEffect, useRef } from "react";
import type { ThemeId } from "../../../lib/types";
import { ALL_THEMES, type ThemeMeta } from "../../../lib/themes";

interface Props {
  open: boolean;
  current: ThemeId;
  pro: boolean;
  onClose: () => void;
  onSelect: (id: ThemeId, requiresPro?: boolean) => void;
}

export function ThemePicker({ open, current, pro, onClose, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const free = ALL_THEMES.filter((t) => !t.pro);
  const proThemes = ALL_THEMES.filter((t) => t.pro);

  function renderGroup(title: string, themes: ThemeMeta[]) {
    return (
      <div className="theme-picker__group">
        <p className="theme-picker__label">{title}</p>
        <div className="theme-picker__grid">
          {themes.map((t) => {
            const locked = Boolean(t.pro && !pro);
            return (
              <button
                key={t.id}
                type="button"
                className="theme-swatch"
                data-active={current === t.id}
                data-locked={locked}
                title={locked ? `${t.label} — Pro` : t.label}
                onClick={() => onSelect(t.id, t.pro)}
              >
                <span
                  className="theme-swatch__chip"
                  style={{ background: t.swatch }}
                />
                <span className="theme-swatch__name">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="theme-picker" role="dialog" aria-label="Themes">
      {renderGroup("Free", free)}
      {renderGroup("Pro · 12 themes", proThemes)}
    </div>
  );
}
