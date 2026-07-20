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
Ranasi Autofill Chrome Extension
```
(≤45 chars · includes autofill + Chrome extension so Store + Google can match)

### Summary
```
Autofill / auto fill web forms in one click. Free Chrome autofill extension with profiles + desktop new tab.
```
(≤132 chars)

### Description — Language = English
```
Ranasi is an autofill extension for Chrome — auto fill web forms in one click from a local profile, plus a desktop-style new tab to pin websites.

AUTOFILL / AUTO FILL
• One-click Auto-Fill on web forms (name, email, phone, address, and more)
• Local profile stored on your device
• Free Chrome extension to start
• Pro: Server AI Auto-Fill for harder forms

CHROME EXTENSION + NEW TAB DESKTOP
• Replace the empty new tab with a themed desktop start page
• Pin favorite websites (unlimited on Pro)
• 12 premium themes on Pro (default Noir Gold)

FREE
• 1 profile · local Auto-Fill
• Mint & Slate themes
• Up to 10 desktop sites

PRO — $10/year
• Server AI fill
• Up to 5 profiles
• Unlimited sites · export / import
• Premium themes

HOW TO START
1. Install this Chrome autofill extension from the Chrome Web Store
2. Open Options → save your autofill profile
3. Open a form → press Auto-Fill with AI
4. Open a new tab → pin sites on your desktop

Pro license: https://www.ranasi.com/pro
Activate: Extension Options → License (or https://www.ranasi.com/activate)
Guides: https://www.ranasi.com/autofill-extension
Privacy: https://www.ranasi.com/privacy
Website: https://www.ranasi.com
Support: bnatharuch@gmail.com
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
| Privacy policy | `https://www.ranasi.com/privacy` |

---

## ขั้นตอนใน Dashboard

1. Package — อัปโหลด zip จาก `npm run zip` (ชื่อ extension ตาม `messages.json`)
2. Store listing — อัปเดต **Title + Summary + Description** ตามข้อความด้านบน (สำคัญมากสำหรับ SEO)
3. Privacy — ตอบตามตาราง
4. Distribution — Visible in store
5. Submit for review

URL Store (ใส่ Vercel ด้วย):

```
NEXT_PUBLIC_EXTENSION_URL=https://chromewebstore.google.com/detail/ranasi/jhnkiofckjnbekegndfoaafeialceplb
```

**ทำไมต้องแก้ชื่อ Store:** ค้น Google ว่า `autofill extension` มักได้ผลจาก Chrome Web Store ก่อน — ถ้าชื่อมีแค่ “Ranasi” จะไม่เข้าคู่คำค้น
