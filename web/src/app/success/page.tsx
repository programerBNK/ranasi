import {
  extensionStoreUrl,
  isExtensionPublished,
} from "@/lib/extension";

export const metadata = {
  title: "ชำระเงินสำเร็จ — Ranasi Pro",
};

export default function SuccessPage() {
  const storeUrl = extensionStoreUrl();
  const published = isExtensionPublished();

  return (
    <main className="shell">
      <nav className="nav">
        <a className="logo" href="/">
          Ranasi
        </a>
        <div className="nav-links">
          <a href="/activate">Activate</a>
          <a href="/#pro-flow">คู่มือหลังจ่าย</a>
        </div>
      </nav>

      <div className="panel" style={{ width: "min(560px, 100%)" }}>
        <h1>ชำระเงินสำเร็จ</h1>
        <p>
          ขอบคุณที่อัปเกรด <strong>Ranasi Pro</strong> — ขั้นตอนถัดไปสำคัญมาก
          ทำจนครบถึงจะใช้ Pro ได้
        </p>

        <ol className="ol">
          <li>
            เปิดอีเมลจาก <strong>Lemon Squeezy</strong> → คัดลอก{" "}
            <strong>License Key</strong>
            <br />
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              (เช็ก Spam ถ้าไม่เจอ)
            </span>
          </li>
          <li>
            ติดตั้ง Ranasi จาก Chrome Web Store ถ้ายังไม่มี
            <br />
            <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
              ไม่ต้องดาวน์โหลดโฟลเดอร์ใดๆ
            </span>
          </li>
          <li>
            Chrome → ไอคอนจิ๊กซอว์ → <strong>Ranasi</strong> → Options
          </li>
          <li>
            แท็บ <strong>License</strong> → วางคีย์ → กด{" "}
            <strong>Activate</strong>
          </li>
          <li>
            เปิดแท็บใหม่ + ใช้ Auto-Fill บนหน้าฟอร์ม — คุณเป็น Pro แล้ว
          </li>
        </ol>

        <div className="cta-row" style={{ marginTop: 22 }}>
          <a className="btn btn-primary" href="/activate">
            ตรวจคีย์ที่นี่ก่อน
          </a>
          {published ? (
            <a
              className="btn btn-ghost"
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
            >
              เปิด Chrome Web Store
            </a>
          ) : (
            <a className="btn btn-ghost" href="/#install">
              ดูวิธีติดตั้ง
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
