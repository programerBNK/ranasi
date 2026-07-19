/** Visual replica of Ranasi Pro Desktop — marketing only */
import type { CSSProperties } from "react";

type Tile = {
  label: string;
  hue: string;
  mark: string;
};

const TILES: Tile[] = [
  { label: "Gmail", hue: "#ea4335", mark: "M" },
  { label: "Drive", hue: "#34a853", mark: "D" },
  { label: "Calendar", hue: "#4285f4", mark: "C" },
  { label: "Docs", hue: "#4285f4", mark: "≡" },
  { label: "ChatGPT", hue: "#10a37f", mark: "◉" },
  { label: "Notion", hue: "#ececec", mark: "N" },
  { label: "Slack", hue: "#e01e5a", mark: "S" },
  { label: "Linear", hue: "#5e6ad2", mark: "L" },
  { label: "Figma", hue: "#f24e1e", mark: "F" },
  { label: "GitHub", hue: "#f0f6fc", mark: "⌘" },
  { label: "Cloudflare", hue: "#f6821f", mark: "☁" },
  { label: "Supabase", hue: "#3ecf8e", mark: "⬡" },
];

export function DesktopPreview() {
  return (
    <div className="desk-preview" aria-hidden>
      <div className="desk-preview-glow" />
      <div className="desk-preview-frame">
        <div className="desk-preview-chrome">
          <span />
          <span />
          <span />
          <div className="desk-preview-url">New Tab — Ranasi</div>
        </div>
        <div className="desk-preview-body">
          <div className="desk-preview-top">
            <div className="desk-preview-brand-block">
              <p className="desk-preview-eyebrow">Pro Desktop</p>
              <p className="desk-preview-title">Ranasi</p>
              <p className="desk-preview-sub">
                12 premium themes · Unlimited websites
              </p>
              <span className="desk-preview-cta">
                Set up your profile → Start Auto-Fill
              </span>
            </div>
            <div className="desk-preview-clock">
              <span>9:41</span>
              <small>Sunday, July 19</small>
              <div className="desk-preview-pills">
                <em>Pro</em>
                <i>Ocean</i>
                <i>Export</i>
              </div>
            </div>
          </div>
          <div className="desk-preview-grid">
            {TILES.map((tile) => (
              <div key={tile.label} className="desk-preview-tile">
                <div
                  className="desk-preview-icon"
                  style={{ "--tile-hue": tile.hue } as CSSProperties}
                >
                  <span>{tile.mark}</span>
                </div>
                <span>{tile.label}</span>
              </div>
            ))}
            <div className="desk-preview-tile desk-preview-tile-add">
              <div className="desk-preview-icon">
                <span>+</span>
              </div>
              <span>Add</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OptionsPreview() {
  return (
    <div className="opts-preview" aria-hidden>
      <div className="opts-preview-chrome">
        <span className="opts-preview-dot" />
        <span className="opts-preview-dot" />
        <span className="opts-preview-dot" />
        <span className="opts-preview-bar">Ranasi</span>
      </div>
      <div className="opts-preview-body">
        <p className="opts-preview-brand">Ranasi</p>
        <p className="opts-preview-lead">
          Set up your profile once, then use Auto-Fill instantly
        </p>
        <div className="opts-preview-tabs">
          <span className="is-active">Profile</span>
          <span>AI</span>
          <span>License</span>
        </div>
        <div className="opts-preview-card">
          <strong>Profile Setup</strong>
          <div className="opts-preview-field" />
          <div className="opts-preview-field" />
          <div className="opts-preview-field short" />
        </div>
      </div>
    </div>
  );
}
