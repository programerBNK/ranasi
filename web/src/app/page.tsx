import { checkoutUrl, isCheckoutConfigured } from "@/lib/checkout";
import {
  extensionStoreUrl,
  isExtensionPublished,
} from "@/lib/extension";

export default function HomePage() {
  const ready = isCheckoutConfigured();
  const payHref = ready ? checkoutUrl() : "/pro";
  const storeUrl = extensionStoreUrl();
  const published = isExtensionPublished();

  return (
    <main className="shell">
      <nav className="nav">
        <div className="logo">Ranasi</div>
        <div className="nav-links">
          <a href="#install">ติดตั้ง</a>
          <a href="#free">ฟรี</a>
          <a href="#whats-new">Pro ต่างยังไง</a>
          <a href="#pro-flow">หลังจ่ายเงิน</a>
          <a href="#pricing">ราคา</a>
          <a href="/activate">Activate</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Ranasi</h1>
        <p>
          Desktop ในแท็บใหม่ + กรอกฟอร์มคลิกเดียว เริ่มฟรี อัปเกรด Pro ได้
          $10/ปี
        </p>
        <div className="cta-row">
          {published ? (
            <a className="btn btn-primary" href={storeUrl} target="_blank" rel="noreferrer">
              ติดตั้งจาก Chrome Web Store — ฟรี
            </a>
          ) : (
            <a className="btn btn-primary" href="#install">
              ดูวิธีติดตั้ง (ฟรี)
            </a>
          )}
          <a className="btn btn-ghost" href="/pro">
            ซื้อ Pro — $10/ปี
          </a>
        </div>
      </section>

      <section className="section" id="install">
        <h2>โหลด Ranasi จากไหน?</h2>
        <p>
          ผู้ใช้ทั่วไป<strong>ไม่ต้องดาวน์โหลดโฟลเดอร์</strong> และไม่ต้องไปเอา
          ไฟล์จาก GitHub
        </p>

        <div className="callout">
          <strong>Production (ผู้ใช้จริง)</strong>
          <p>
            ติดตั้งจาก <strong>Chrome Web Store</strong> เท่านั้น — กด Add to
            Chrome แล้วใช้ได้ทันที ไม่มีโฟลเดอร์ให้โหลด
          </p>
          {published ? (
            <a className="btn btn-primary" href={storeUrl} target="_blank" rel="noreferrer">
              เปิด Chrome Web Store
            </a>
          ) : (
            <p className="note">
              ตอนนี้ยังไม่ขึ้น Store — พอเผยแพร่แล้วปุ่มติดตั้งจะชี้ไปที่ลิงก์
              Store โดยตรง (ตั้งค่า <code>NEXT_PUBLIC_EXTENSION_URL</code>)
            </p>
          )}
        </div>

        <div className="callout callout-muted">
          <strong>นักพัฒนาเท่านั้น (ไม่ใช่สำหรับลูกค้า)</strong>
          <p>
            ตอนเขียนโค้ดใช้ <code>Load unpacked</code> จากโฟลเดอร์ build เช่น{" "}
            <code>.output/chrome-mv3-dev</code> —{" "}
            <em>ลูกค้าที่จ่ายเงินไม่ต้องทำแบบนี้</em>
          </p>
        </div>
      </section>

      <section className="section" id="free">
        <h2>ใช้แบบฟรี ทำยังไง</h2>
        <p>ฟรีตลอดชีพ — ไม่ต้องใส่รหัส ไม่ต้องจ่ายเงิน</p>
        <ol className="guide-list">
          <li>
            <strong>ติดตั้ง Ranasi</strong>
            <span>
              จาก Chrome Web Store → อนุญาตสิทธิ์ที่ขอ → พร้อมใช้
            </span>
          </li>
          <li>
            <strong>ตั้งค่า Profile ครั้งเดียว</strong>
            <span>
              คลิกขวาไอคอน extension → Options (หรือปุ่มตั้งค่าบน New Tab) →
              กรอกชื่อ อีเมล ที่อยู่ ฯลฯ → บันทึก เก็บในเครื่องคุณเท่านั้น
            </span>
          </li>
          <li>
            <strong>ใช้ Desktop (แท็บใหม่)</strong>
            <span>
              เปิดแท็บใหม่ จะเห็นไอคอนเว็บที่เคยเข้า ปักหมุด ลากจัดเรียง
              เปลี่ยนชื่อใต้ไอคอนได้
            </span>
          </li>
          <li>
            <strong>Auto-Fill ฟอร์ม</strong>
            <span>
              เปิดหน้าที่มีฟอร์ม → กดปุ่ม <em>Auto-Fill with AI</em> มุมขวาล่าง
              → ระบบกรอกจาก Profile (โหมดฟรีใช้ heuristic ในเครื่อง)
            </span>
          </li>
        </ol>
        <div className="feature-grid">
          <div className="feature">
            <strong>ได้ในฟรี</strong>
            <ul>
              <li>Desktop แท็บใหม่</li>
              <li>1 Profile</li>
              <li>Auto-Fill ในเครื่อง</li>
              <li>ธีม Mint / Slate</li>
              <li>เพิ่มเว็บบน Desktop ได้สูงสุด 10</li>
            </ul>
          </div>
          <div className="feature">
            <strong>ยังไม่ได้จนกว่าจะเป็น Pro</strong>
            <ul>
              <li>Server AI กรอกฉลาดขึ้น</li>
              <li>สูงสุด 5 Profiles</li>
              <li>12 ธีมพรีเมียม (Noir Gold default)</li>
              <li>เพิ่มเว็บได้ไม่จำกัด</li>
              <li>Export / Import</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="whats-new">
        <h2>Pro ต่างจากฟรียังไง (ล่าสุด)</h2>
        <p>อัปเกรดแล้ว Desktop ดูแพงขึ้นชัดเจน — และใช้งานได้กว้างกว่า</p>
        <ol className="guide-list numbered">
          <li>
            <strong>ธีม Pro default: Noir Gold</strong>
            <span>
              พื้นหลังลึก มีเงาหลายชั้น สะท้อนแสงบนไอคอน — ดูทันสมัยและ professional
              กว่าธีมฟรีมาก
            </span>
          </li>
          <li>
            <strong>เลือกได้ 12 ธีม Pro</strong>
            <span>
              Noir Gold, Ember, Arctic, Ocean, Forest, Rose, Graphite, Sand,
              Aurora, Copper, Ivory, Azure — สลับได้จากปุ่ม Theme บนแท็บใหม่
            </span>
          </li>
          <li>
            <strong>เว็บบน Desktop ไม่จำกัด</strong>
            <span>
              ฟรีเพิ่มได้สูงสุด 10 เว็บ · Pro เพิ่มได้ไม่จำกัด (ปักหมุด / ลากจัดเรียงได้ตามใจ)
            </span>
          </li>
          <li>
            <strong>Server AI + 5 Profiles + Export</strong>
            <span>เหมือนเดิม — กรอกฟอร์มฉลาดขึ้น และจัดการโปรไฟล์ได้หลายชุด</span>
          </li>
        </ol>
      </section>

      <section className="section" id="pro-flow">
        <h2>จ่ายเงินแล้ว ได้รหัสจากอีเมล — ทำต่อยังไง</h2>
        <p>ทำตามลำดับนี้จนใช้งาน Pro ได้</p>
        <ol className="guide-list numbered">
          <li>
            <strong>จ่าย $10/ปี</strong>
            <span>
              ไปหน้า <a href="/pro">Get Pro</a> → จ่ายผ่าน Lemon Squeezy (บัตร
              / ช่องทางที่รองรับ) → ได้ใบเสร็จทางอีเมล
            </span>
          </li>
          <li>
            <strong>รับ License Key</strong>
            <span>
              เปิดอีเมลจาก <strong>Lemon Squeezy</strong> → คัดลอก{" "}
              <strong>License Key</strong> (รหัสยาวๆ) · หน้า Success บนเว็บก็อาจ
              โชว์คีย์ด้วย
            </span>
          </li>
          <li>
            <strong>ติดตั้ง Extension ก่อน (ถ้ายังไม่มี)</strong>
            <span>
              ต้องมี Ranasi จาก Chrome Web Store อยู่แล้ว —{" "}
              <em>ไม่ต้องโหลดโฟลเดอร์</em>
            </span>
          </li>
          <li>
            <strong>วางคีย์ใน Extension</strong>
            <span>
              Chrome → ไอคอน puzzle มุมขวา → Ranasi → <strong>Options</strong>{" "}
              → แท็บ <strong>License</strong> → วางคีย์ → กด{" "}
              <strong>Activate</strong>
            </span>
          </li>
          <li>
            <strong>เริ่มใช้ Pro</strong>
            <span>
              สถานะเป็น Pro → แท็บใหม่เปิดธีม <strong>Noir Gold</strong> อัตโนมัติ
              → เลือกได้อีก 11 ธีม · เพิ่มเว็บได้ไม่จำกัด · Auto-Fill ใช้ Server AI ·
              Profile ได้ถึง 5
            </span>
          </li>
        </ol>
        <div className="cta-row">
          <a className="btn btn-primary" href={payHref}>
            {ready ? "ไปจ่ายเงิน Pro" : "ดูหน้า Get Pro"}
          </a>
          <a className="btn btn-ghost" href="/activate">
            ตรวจคีย์ / ดูวิธี Activate
          </a>
        </div>
        <div className="callout" style={{ marginTop: 24 }}>
          <strong>ถ้าหาอีเมลไม่เจอ</strong>
          <p>
            เช็ก Spam / โฟลเดอร์โปรโมชัน · ค้นหาคำว่า Lemon Squeezy หรือ Ranasi ·
            หรือเปิดหน้า <a href="/activate">/activate</a> วางคีย์เพื่อตรวจว่าใช้ได้
            ก่อนใส่ใน Extension
          </p>
        </div>
      </section>

      <section className="section" id="pricing">
        <h2>ราคา</h2>
        <p>โปรไฟล์เก็บในเครื่องคุณ · Pro AI รันบนเซิร์ฟเวอร์ Ranasi</p>
        <div className="pricing">
          <div className="price-card">
            <h3>Free</h3>
            <div className="price">
              $0 <small>ตลอดชีพ</small>
            </div>
            <ul>
              <li>ติดตั้งจาก Chrome Web Store</li>
              <li>Desktop + 1 Profile</li>
              <li>Auto-Fill ในเครื่อง</li>
              <li>ธีม Mint / Slate</li>
              <li>เพิ่มเว็บได้สูงสุด 10</li>
            </ul>
            <a className="btn btn-ghost" href="#free">
              วิธีใช้ฟรี
            </a>
          </div>
          <div className="price-card featured">
            <h3>Pro</h3>
            <div className="price">
              $10 <small>/ ปี</small>
            </div>
            <ul>
              <li>ได้ License Key ทางอีเมล</li>
              <li>Server AI Auto-Fill</li>
              <li>สูงสุด 5 Profiles</li>
              <li>12 ธีมพรีเมียม (Noir Gold default)</li>
              <li>เพิ่มเว็บได้ไม่จำกัด</li>
              <li>Export / Import</li>
            </ul>
            <a className="btn btn-primary" href={payHref}>
              {ready ? "จ่าย $10/ปี" : "Get Pro"}
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <strong>Ranasi</strong>
        <span>
          ผู้ใช้จริง = Chrome Web Store · ไม่ใช้โฟลเดอร์ · คีย์ Pro มาจากอีเมลหลังจ่าย
        </span>
      </footer>
    </main>
  );
}
