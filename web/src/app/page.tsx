import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";

export default function HomePage() {
  const ready = isCheckoutConfigured();
  const payHref = ready ? checkoutUrl() : "/pro";

  return (
    <main className="shell">
      <nav className="nav">
        <div className="logo">AutoFlow</div>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="/pro">Get Pro</a>
          <a href="/activate">Activate</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Your browser desktop — fill forms in one click.</h1>
        <p>
          Install free. Set your profile once. Click Auto-Fill. Upgrade to Pro for
          server AI — just $10 a year.
        </p>
        <div className="cta-row">
          <a className="btn btn-primary" href={payHref}>
            {ready ? "Get Pro — $10/year" : "How to get Pro — $10/year"}
          </a>
          <a className="btn btn-ghost" href="#how">
            See how it works
          </a>
        </div>
      </section>

      <section className="section" id="how">
        <h2>จากฟรี → Pro ใน 3 ขั้น</h2>
        <p>จ่ายเงินบนเว็บนี้ · ใช้คีย์ใน Extension</p>
        <div className="steps">
          <div className="step">
            <strong>1. ติดตั้งฟรี</strong>
            <span>Chrome Web Store / Load unpacked ตอนพัฒนา</span>
          </div>
          <div className="step">
            <strong>2. จ่าย $10/ปี</strong>
            <span>
              กด <a href="/pro" style={{ color: "var(--accent)" }}>Get Pro</a> →
              Lemon Squeezy รับชำระ → ได้ License Key อีเมล
            </span>
          </div>
          <div className="step">
            <strong>3. Activate</strong>
            <span>
              Extension Options → License → วางคีย์ หรือหน้า{" "}
              <a href="/activate" style={{ color: "var(--accent)" }}>
                /activate
              </a>
            </span>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <h2>Simple pricing</h2>
        <p>Local-first profiles. Pro AI อยู่บนเซิร์ฟเวอร์ของคุณ</p>
        <div className="pricing">
          <div className="price-card">
            <h3>Free</h3>
            <div className="price">
              $0 <small>forever</small>
            </div>
            <ul>
              <li>Desktop new tab</li>
              <li>1 profile</li>
              <li>Heuristic Auto-Fill</li>
              <li>Mint + Slate themes</li>
            </ul>
            <a className="btn btn-ghost" href="#how">
              Start free
            </a>
          </div>
          <div className="price-card featured">
            <h3>Pro</h3>
            <div className="price">
              $10 <small>/ year</small>
            </div>
            <ul>
              <li>Server AI Auto-Fill</li>
              <li>Up to 5 profiles</li>
              <li>Export / import</li>
              <li>Ember theme + smart workflows</li>
            </ul>
            <a className="btn btn-primary" href={payHref}>
              {ready ? "Pay $10/year" : "Get Pro — setup pay"}
            </a>
          </div>
        </div>
        {!ready && (
          <p style={{ marginTop: 18, color: "var(--muted)", fontSize: "0.95rem" }}>
            ยังไม่ได้เชื่อม Lemon Squeezy — ไปที่{" "}
            <a href="/pro" style={{ color: "var(--accent)" }}>
              /pro
            </a>{" "}
            เพื่อดูวิธีต่อช่องทางจ่ายเงิน (หรือทดสอบด้วย AF-DEV-PRO)
          </p>
        )}
      </section>
    </main>
  );
}
