import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import {
  extensionStoreUrl,
  isExtensionPublished,
} from "@/lib/extension";
import styles from "./pro.module.css";

export const metadata = {
  title: "Get Ranasi Pro — $10/year",
  description:
    "Pay $10/year, get a license key by email, activate in the extension.",
};

export default function ProPage() {
  const ready = isCheckoutConfigured();
  const payUrl = checkoutUrl();
  const storeUrl = extensionStoreUrl();
  const published = isExtensionPublished();

  return (
    <main className="shell">
      <nav className="nav">
        <a className="logo" href="/">
          Ranasi
        </a>
        <div className="nav-links">
          <a href="/#free">ใช้ฟรี</a>
          <a href="/#pro-flow">หลังจ่ายเงิน</a>
          <a href="/activate">Activate</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Ranasi Pro</p>
        <h1>จ่าย $10/ปี → ได้รหัสทางอีเมล → ใช้งาน Pro</h1>
        <p className={styles.lead}>
          ไม่ต้องโหลดโฟลเดอร์ใดๆ · ติดตั้งจาก Chrome Web Store · วาง License Key
          ใน Extension Options เท่านั้น
        </p>
      </section>

      <section className={styles.payCard}>
        <div className={styles.priceRow}>
          <div>
            <h2>Pro annual</h2>
            <p className={styles.muted}>รายปี · ได้คีย์ทางอีเมลหลังชำระ</p>
          </div>
          <div className={styles.price}>
            $10<span>/year</span>
          </div>
        </div>

        <ul className={styles.perks}>
          <li>Server AI Auto-Fill</li>
          <li>สูงสุด 5 Profiles</li>
          <li>12 ธีมพรีเมียม — default Noir Gold (เงาหลายมิติ)</li>
          <li>เพิ่มเว็บบน Desktop ได้ไม่จำกัด (ฟรีจำกัด 10)</li>
          <li>Export / Import</li>
        </ul>

        {ready ? (
          <>
            <a
              className="btn btn-primary"
              href={payUrl}
              target="_blank"
              rel="noreferrer"
            >
              จ่ายด้วย Lemon Squeezy — $10/ปี
            </a>
            <p className={styles.hint}>
              หลังจ่ายสำเร็จ → เช็กอีเมลหา License Key → ทำตามขั้นตอนด้านล่าง
            </p>
          </>
        ) : (
          <div className={styles.setupBox}>
            <strong>ช่องทางจ่ายเงินยังไม่พร้อมบนเว็บนี้</strong>
            <p>
              เจ้าของร้านต้องตั้งค่า Lemon Squeezy ก่อน ผู้ใช้จริงจะเห็นปุ่มจ่ายเงิน
            </p>
            <div className="cta-row" style={{ marginTop: 18 }}>
              <a className="btn btn-ghost" href="/activate">
                นักพัฒนา: ทดสอบด้วย RN-DEV-PRO
              </a>
            </div>
          </div>
        )}
      </section>

      <p className={styles.hint}>
        Local development: use <code>RN-DEV-PRO</code>. The legacy{" "}
        <code>AF-DEV-PRO</code> key also works when dev licenses are enabled.
      </p>

      <section className="section" id="after-pay">
        <h2>หลังได้รหัสจากอีเมล — ทีละขั้นจนใช้ได้</h2>
        <ol className="guide-list numbered">
          <li>
            <strong>เปิดอีเมลจาก Lemon Squeezy</strong>
            <span>
              คัดลอก <strong>License Key</strong> ทั้งชุด · ถ้าไม่เจอ เช็ก Spam
            </span>
          </li>
          <li>
            <strong>ติดตั้ง Ranasi (ถ้ายังไม่มี)</strong>
            <span>
              {published ? (
                <>
                  จาก{" "}
                  <a href={storeUrl} target="_blank" rel="noreferrer">
                    Chrome Web Store
                  </a>{" "}
                  — ไม่ต้องดาวน์โหลดโฟลเดอร์
                </>
              ) : (
                <>
                  จาก Chrome Web Store (เมื่อเผยแพร่แล้ว) —{" "}
                  <em>ผู้ใช้จริงไม่ใช้ Load unpacked / ไม่ใช้โฟลเดอร์โปรเจกต์</em>
                </>
              )}
            </span>
          </li>
          <li>
            <strong>เปิด Extension Options</strong>
            <span>
              Chrome มุมขวาบน → ไอคอนชิ้นส่วนจิ๊กซอว์ → Ranasi →{" "}
              <strong>ตัวเลือกส่วนขยาย (Options)</strong>
            </span>
          </li>
          <li>
            <strong>แท็บ License → วางคีย์ → Activate</strong>
            <span>สถานะต้องขึ้น Pro · ถ้าผิดพลาด ลองหน้า /activate ตรวจคีย์ก่อน</span>
          </li>
          <li>
            <strong>ใช้งาน</strong>
            <span>
              เปิดแท็บใหม่ → ได้ธีม <strong>Noir Gold</strong> อัตโนมัติ · เลือกได้อีก
              11 ธีม · เพิ่มเว็บได้ไม่จำกัด · ตั้ง Profile · กด Auto-Fill with AI
            </span>
          </li>
        </ol>
        <div className="cta-row">
          <a className="btn btn-primary" href="/activate">
            ไปหน้า Activate / ตรวจคีย์
          </a>
          <a className="btn btn-ghost" href="/#free">
            ยังไม่ซื้อ — ใช้ฟรีก่อน
          </a>
        </div>
      </section>
    </main>
  );
}
