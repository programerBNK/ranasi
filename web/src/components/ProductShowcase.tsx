/** Visual replica of Ranasi Pro Desktop — marketing only */
const TILES = [
  "Gmail",
  "Drive",
  "Calendar",
  "Docs",
  "ChatGPT",
  "Notion",
  "Slack",
  "Linear",
  "Figma",
  "GitHub",
  "Cloudflare",
  "Supabase",
];

export function DesktopPreview() {
  return (
    <div className="desk-preview" aria-hidden>
      <div className="desk-preview-glow" />
      <div className="desk-preview-frame">
        <div className="desk-preview-top">
          <div>
            <p className="desk-preview-eyebrow">Pro Desktop</p>
            <p className="desk-preview-title">Ranasi</p>
            <p className="desk-preview-sub">
              12 premium themes · Unlimited websites
            </p>
            <span className="desk-preview-cta">Set up your profile → Start Auto-Fill</span>
          </div>
          <div className="desk-preview-clock">
            <span>9:41</span>
            <small>Sunday, July 19</small>
          </div>
        </div>
        <div className="desk-preview-grid">
          {TILES.map((label) => (
            <div key={label} className="desk-preview-tile">
              <div className="desk-preview-icon">{label.slice(0, 1)}</div>
              <span>{label}</span>
            </div>
          ))}
          <div className="desk-preview-tile desk-preview-tile-add">
            <div className="desk-preview-icon">+</div>
            <span>Add</span>
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
