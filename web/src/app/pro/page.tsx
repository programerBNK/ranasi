import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import styles from "./pro.module.css";

export const metadata = {
  title: "Get AutoFlow Pro — $10/year",
  description: "Pay once a year. Unlock server AI autofill, multi-profile, and export.",
};

export default function ProPage() {
  const ready = isCheckoutConfigured();
  const payUrl = checkoutUrl();

  return (
    <main className="shell">
      <nav className="nav">
        <a className="logo" href="/">
          AutoFlow
        </a>
        <div className="nav-links">
          <a href="/#pricing">Pricing</a>
          <a href="/activate">Activate</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>AutoFlow Pro</p>
        <h1>Pay $10/year — unlock server AI autofill</h1>
        <p className={styles.lead}>
          จ่ายผ่าน Lemon Squeezy (บัตรเครดิต / ช่องทางที่รองรับ) → ได้ License Key
          ทางอีเมล → วางใน Extension → เป็น Pro ทันที
        </p>
      </section>

      <section className={styles.payCard}>
        <div className={styles.priceRow}>
          <div>
            <h2>Pro annual</h2>
            <p className={styles.muted}>ต่ออายุรายปี · ยกเลิกได้ตามรอบบิล</p>
          </div>
          <div className={styles.price}>
            $10<span>/year</span>
          </div>
        </div>

        <ul className={styles.perks}>
          <li>Server AI Auto-Fill (ไม่ต้องใส่ OpenAI key เอง)</li>
          <li>ได้ถึง 5 profiles</li>
          <li>Export / Import โปรไฟล์</li>
          <li>Ember theme + ฟีเจอร์ Pro ต่อๆ ไป</li>
        </ul>

        {ready ? (
          <>
            <a className="btn btn-primary" href={payUrl} target="_blank" rel="noreferrer">
              Pay with Lemon Squeezy — $10/year
            </a>
            <p className={styles.hint}>
              หลังจ่ายสำเร็จ ระบบพาไปหน้า Success · License Key ส่งเข้าอีเมลที่ใช่ชำระเงิน
            </p>
          </>
        ) : (
          <div className={styles.setupBox}>
            <strong>ยังไม่ได้ต่อช่องทางจ่ายเงิน</strong>
            <p>
              ตั้งค่า Lemon Squeezy แล้วใส่ checkout URL ใน{" "}
              <code>web/.env.local</code>:
            </p>
            <pre className={styles.code}>{`NEXT_PUBLIC_CHECKOUT_URL=https://YOUR_STORE.lemonsqueezy.com/checkout/buy/VARIANT_ID
NEXT_PUBLIC_APP_URL=http://localhost:3120`}</pre>
            <ol className={styles.setupSteps}>
              <li>สมัคร <a href="https://www.lemonsqueezy.com" target="_blank" rel="noreferrer">Lemon Squeezy</a></li>
              <li>สร้าง Product <strong>AutoFlow Pro</strong> · ราคา <strong>$10 / year</strong></li>
              <li>เปิด License Keys บนสินค้า</li>
              <li>คัดลอก Shareable Checkout URL → วางใน env ด้านบน</li>
              <li>Webhook (production): <code>https://YOUR_API/v1/webhooks/lemonsqueezy</code></li>
              <li>รีสตาร์ท <code>npm run dev:web</code> แล้วปุ่ม Pay จะโผล่</li>
            </ol>
            <div className="cta-row" style={{ marginTop: 18 }}>
              <a className="btn btn-ghost" href="/activate">
                ทดสอบ Pro แบบ local (AF-DEV-PRO)
              </a>
            </div>
          </div>
        )}
      </section>

      <section className={styles.flow}>
        <h2>หลังจ่ายเงิน ทำยังไง</h2>
        <div className="steps">
          <div className="step">
            <strong>1. จ่าย $10</strong>
            <span>Lemon Squeezy รับบัตร · ออกใบเสร็จให้คุณ</span>
          </div>
          <div className="step">
            <strong>2. ได้ License Key</strong>
            <span>เช็กอีเมลจาก Lemon Squeezy (และหน้า Success)</span>
          </div>
          <div className="step">
            <strong>3. Activate</strong>
            <span>
              เปิด Extension Options → License → วางคีย์ → หรือใช้หน้า{" "}
              <a href="/activate">/activate</a>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
