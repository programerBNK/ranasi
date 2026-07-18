# Chrome Web Store — Ranasi (กรอกตามฟอร์ม)

โฟลเดอร์: `~/Documents/ranasi/store-listing/`  
มีรูปขนาดถูกต้องแล้ว + ข้อความด้านล่างสำหรับวางใน Dashboard

---

## ไฟล์รูป → ช่องอัปโหลด

| ช่องใน Dashboard | ไฟล์ | ขนาด |
|------------------|------|------|
| **Store icon** * | `store-icon-128.png` | 128×128 |
| **Screenshots** * | `screenshot-1-1280x800.png` | 1280×800 |
| **Screenshots** | `screenshot-2-1280x800.png` | 1280×800 |
| Small promo tile | `promo-small-440x280.png` | 440×280 |
| Marquee promo tile | `promo-marquee-1400x560.png` | 1400×560 |
| Global promo video | *(เว้นว่างได้)* | — |

PNG 24-bit ไม่มี alpha ตามสเปก Store

---

## Product details

### Title
```
Ranasi
```

### Summary
```
Smart AI Browser Assistant — one-click autofill from your local profile
```

### Description — Language = English
```
Ranasi fills web forms in one click from a profile you keep on your device.

FREE
• Save your profile (name, email, phone, address, and more)
• One-click Auto-Fill on supported sites
• Mint & Slate themes
• Up to 10 desktop sites

PRO ($10/year)
• 12 premium themes (default Noir Gold)
• Unlimited sites
• Up to 5 profiles
• Server AI fill for harder forms
• Export / import

How to get started
1. Install Ranasi from the Chrome Web Store
2. Open Options and create your profile
3. Visit a form page and click Auto-Fill

Pro license
• Buy at https://www.ranasi.com/pro
• Activate the key in Extension Options → License
• Or validate on https://www.ranasi.com/activate

Privacy
• Free fill runs from your local profile in the browser
• Pro license checks and optional AI fill use https://api.ranasi.com
• We do not sell your data

Website: https://www.ranasi.com
Support: https://www.ranasi.com
```

### Category *
```
Productivity
```

### Language *
```
English
```

---

## Additional fields

| ช่อง | ค่าที่ใส่ |
|------|-----------|
| **Homepage URL** | `https://www.ranasi.com` |
| **Support URL** | `https://www.ranasi.com` |
| **Official URL** | Add a new site → `https://www.ranasi.com` (verify ใน Search Console) |
| **Mature content** | **OFF** |
| Item support | เปิดได้ตามต้องการ |

---

## Privacy tab (แนวตอบ)

| หัวข้อ | ตอบ |
|--------|-----|
| Single purpose | Autofill forms from a user-managed local profile; Pro adds license validation and optional AI assist |
| Uses remote code | No |
| Data | License key/instance for Pro; optional form context when using server AI fill |
| Remote host | `https://api.ranasi.com` |
| Privacy policy | `https://www.ranasi.com` |

---

## ขั้นตอนใน Dashboard

1. Package — อัปโหลด zip จาก `npm run zip` (ถ้ายังไม่ขึ้น)
2. Store listing — อัปโหลดรูปตามตาราง + วางข้อความด้านบน
3. Privacy — ตอบตามตาราง
4. Distribution — เลือกภูมิภาค / Visible in store
5. Submit for review

หลังอนุมัติ เอา URL Store ใส่ Vercel:

```
NEXT_PUBLIC_EXTENSION_URL=https://chromewebstore.google.com/detail/ranasi/XXXX
```
