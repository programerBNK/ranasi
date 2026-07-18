export default function SuccessPage() {
  return (
    <main className="shell">
      <div className="panel">
        <h1>ชำระเงินสำเร็จ</h1>
        <p>
          ขอบคุณที่อัปเกรด AutoFlow Pro · เช็กอีเมลจาก Lemon Squeezy สำหรับ{" "}
          <strong>License Key</strong> แล้วปลดล็อกใน Extension:
        </p>
        <ol className="ol">
          <li>Chrome → Extensions → AutoFlow → Extension options</li>
          <li>แท็บ License → วาง License Key</li>
          <li>กด Activate — สถานะเป็น Pro</li>
        </ol>
        <div className="cta-row" style={{ marginTop: 22 }}>
          <a className="btn btn-primary" href="/activate">
            ไปหน้า Activate
          </a>
          <a className="btn btn-ghost" href="/pro">
            กลับหน้า Pro
          </a>
        </div>
      </div>
    </main>
  );
}
