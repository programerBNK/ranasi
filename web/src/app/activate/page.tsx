"use client";

import { useState } from "react";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3130").replace(
  /\/$/,
  "",
);

export default function ActivatePage() {
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`${API}/v1/license/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: key.trim(),
          instanceName: "Ranasi-Web",
        }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        error?: string;
        expiresAt?: string | null;
      };

      if (!res.ok || !data.valid) {
        setMsg({ type: "err", text: data.error || "Activation failed" });
        return;
      }

      setMsg({
        type: "ok",
        text: data.expiresAt
          ? `คีย์ใช้ได้ถึง ${new Date(data.expiresAt).toLocaleDateString("th-TH")} — ขั้นตอนถัดไป: วางคีย์เดียวกันใน Extension Options → License → Activate`
          : "คีย์ใช้ได้ — ขั้นตอนถัดไป: วางคีย์เดียวกันใน Extension Options → License → Activate",
      });
    } catch {
      setMsg({
        type: "err",
        text: `เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (${API}) — ลองใหม่ภายหลัง หรือวางคีย์ตรงใน Extension`,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <nav className="nav">
        <a className="logo" href="/">
          Ranasi
        </a>
        <div className="nav-links">
          <a href="/#pro-flow">หลังจ่ายเงิน</a>
          <a href="/pro">Get Pro</a>
        </div>
      </nav>

      <section className="section" style={{ marginTop: 0 }}>
        <h2>Activate License Key</h2>
        <p>
          ได้รหัสจากอีเมลหลังจ่ายเงินแล้ว — ตรวจคีย์ที่นี่ได้ แล้วไปวางใน
          Extension เพื่อปลดล็อก Pro จริง
        </p>
      </section>

      <ol className="guide-list numbered" style={{ marginBottom: 28 }}>
        <li>
          <strong>คัดลอก License Key จากอีเมล</strong>
          <span>อีเมลจาก Lemon Squeezy หลังชำระเงินสำเร็จ</span>
        </li>
        <li>
          <strong>(ตัวเลือก) ตรวจคีย์บนหน้านี้</strong>
          <span>วางด้านล่าง → กด Validate — รู้ทันทีว่าคีย์ใช้ได้ไหม</span>
        </li>
        <li>
          <strong>ปลดล็อกใน Extension</strong>
          <span>
            Chrome → ไอคอนจิ๊กซอว์ → Ranasi → Options → แท็บ License → วางคีย์ →
            Activate · <em>ไม่ต้องโหลดโฟลเดอร์ใดๆ</em>
          </span>
        </li>
        <li>
          <strong>เริ่มใช้ Pro</strong>
          <span>เปิดแท็บใหม่ + กด Auto-Fill บนหน้าฟอร์ม</span>
        </li>
      </ol>

      <form className="panel" onSubmit={onSubmit} style={{ marginTop: 0 }}>
        <h1>วาง License Key</h1>
        <p>
          คีย์จากอีเมลหลังซื้อ Pro · หน้านี้แค่ตรวจคีย์ — การปลดล็อกจริงอยู่ที่
          Extension Options
        </p>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="วาง License Key ที่นี่"
          spellCheck={false}
          autoComplete="off"
        />
        <button className="btn btn-primary" type="submit" disabled={busy || !key}>
          {busy ? "กำลังตรวจ…" : "Validate key"}
        </button>
        {msg && <p className={`msg ${msg.type}`}>{msg.text}</p>}
        <p className="meta" style={{ marginTop: 14 }}>
          Local development: use <code>RN-DEV-PRO</code>. The legacy{" "}
          <code>AF-DEV-PRO</code> key also works when dev licenses are enabled.
        </p>
      </form>

      <div className="callout" style={{ marginTop: 28 }}>
        <strong>ยังไม่มี Extension?</strong>
        <p>
          ติดตั้งจาก Chrome Web Store ก่อน (ดูหน้า{" "}
          <a href="/#install">หน้าแรก → ติดตั้ง</a>) — ผู้ใช้จริงไม่ใช้โฟลเดอร์โปรเจกต์
        </p>
      </div>
    </main>
  );
}
