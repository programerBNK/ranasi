# Lemon Squeezy + Ranasi (ทำคู่ขนานกับ Chrome Store)

เป้าหมาย:
1. ปุ่มจ่ายบน https://www.ranasi.com/pro
2. Webhook บันทึก license ลง DB
3. Activate ที่ https://www.ranasi.com/activate ใช้คีย์จริงได้

---

## A) Lemon Squeezy Dashboard

1. เปิด https://app.lemonsqueezy.com → สมัคร / ล็อกอิน  
2. สร้าง **Store** (ถ้ายังไม่มี)  
3. **Products → + New product**
   - Name: `Ranasi Pro`
   - Price: `$10` · Billing: **Subscription · Yearly**
   - เปิด **Generate license keys** (สำคัญ)
   - Activation limit: **5** (ตรงกับโค้ด)
4. บันทึก Product → เปิด Variant → กด **Share** / Copy checkout link  
   ได้ประมาณ:
   ```text
   https://YOUR_STORE.lemonsqueezy.com/checkout/buy/VARIANT_ID
   ```
5. (แนะนำ) Checkout settings → Success URL:
   ```text
   https://www.ranasi.com/success
   ```

---

## B) Webhook → Railway API

1. Lemon → **Settings → Webhooks → +**
2. Callback URL:
   ```text
   https://api.ranasi.com/v1/webhooks/lemonsqueezy
   ```
3. เลือกอย่างน้อย:
   - `license_key_created`
   - `license_key_updated`
4. สร้างแล้ว **คัดลอก Signing secret**
5. Railway → service **ranasi** → Variables:
   ```text
   LEMONSQUEEZY_WEBHOOK_SECRET=<secret จากข้อ 4>
   ALLOW_DEV_LICENSE=false
   ```
6. Deploy / รอ container ขึ้นใหม่

อย่าชี้ webhook ไปที่ `www.ranasi.com/api/webhooks/...` (เลิกใช้แล้ว → 410)

---

## C) Vercel — ปุ่มจ่ายบน /pro

Vercel → Project **ranasi** → Settings → Environment Variables → **Production**:

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_CHECKOUT_URL` | checkout link จากข้อ A4 |
| `NEXT_PUBLIC_APP_URL` | `https://www.ranasi.com` (มีแล้ว) |
| `NEXT_PUBLIC_API_URL` | `https://api.ranasi.com` (มีแล้ว) |

แล้ว **Redeploy** Production

ตรวจ: เปิด https://www.ranasi.com/pro ต้องเห็นปุ่ม  
**จ่ายด้วย Lemon Squeezy — $10/ปี**  
(ไม่ขึ้นกล่อง “ช่องทางจ่ายเงินยังไม่พร้อม”)

---

## D) ทดสอบ Activate / API

### 1) Health
```bash
curl -sS https://api.ranasi.com/health
```
ควรได้ `"ok":true,"ready":true`

### 2) Activate ด้วยคีย์ปลอม (ควร fail สุภาพ)
```bash
curl -sS -X POST https://api.ranasi.com/v1/license/activate \
  -H 'Content-Type: application/json' \
  -d '{"licenseKey":"TEST-INVALID","instanceName":"Ranasi-Web"}'
```

### 3) ซื้อทดสอบ (Lemon test mode) หรือซื้อจริง $10
- จ่าย → ได้ License Key ทางอีเมล  
- เปิด https://www.ranasi.com/activate → วางคีย์ → Validate  
- วางคีย์เดียวกันใน Extension Options → License → Activate  

### 4) ดูว่า webhook ทำงาน
Railway → Deploy Logs หลังซื้อ ควรมี:
```text
lemonsqueezy webhook: license_key_created
```

---

## ลำดับที่แนะนำ

1. สร้าง Product + checkout link (A)  
2. ตั้ง webhook + `LEMONSQUEEZY_WEBHOOK_SECRET` (B)  
3. ใส่ `NEXT_PUBLIC_CHECKOUT_URL` + Redeploy (C)  
4. เปิด `/pro` ยืนยันปุ่มจ่าย  
5. ซื้อทดสอบ → `/activate` → Extension  

ส่ง **checkout URL** มาได้ (ไม่ต้องส่ง secret) จะช่วยเช็ครูปแบบลิงก์ให้  
หรือถ้าตั้ง Vercel CLI ได้แล้ว บอกให้ช่วยใส่ env ให้ได้
