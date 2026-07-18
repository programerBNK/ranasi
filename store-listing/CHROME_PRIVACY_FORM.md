# Chrome Web Store — Privacy tab (วางทีละช่อง)

Privacy Policy URL (หลัง deploy):
```
https://www.ranasi.com/privacy
```

---

## Single purpose (มีแล้ว — เก็บได้)
```
Autofill forms from a user-managed local profile; Pro adds license validation and optional AI assist
```

---

## Permission justifications

### storage *
```
Stores the user’s autofill profiles, theme/settings, license cache, and new-tab preferences locally in chrome.storage so autofill and the desktop new tab work offline without re-entering data each session.
```

### history *
```
Reads visit history only to count frequently visited domains for the Ranasi desktop new-tab site list. We do not upload full browsing history to our servers.
```

### tabs *
```
Reads the active tab URL/title so Auto-Fill can run on the page the user is viewing and so the new-tab experience can refresh site shortcuts. We do not inject unrelated tracking.
```

### Host permission *
```
Needs access to http/https pages the user opens so the content script can detect form fields and fill them on demand. Also calls https://api.ranasi.com for Pro license and optional server AI fill, and optionally https://api.openai.com when the user enables their own OpenAI key.
```

---

## Remote code

เลือก: **No, I am not using remote code**

(อย่าเลือก Yes — การ `fetch` ไป API ไม่นับเป็น remote code ตามนิยามของ Google ซึ่งหมายถึงโหลด/รัน JS จากภายนอก เช่น eval หรือ script ภายนอก)

ถ้าฟอร์มบังคับมีช่องเพราะเคยเลือก Yes อยู่ ให้เปลี่ยนเป็น **No** แล้ว Save

---

## What user data do you collect? (ติ๊กเฉพาะที่เกี่ยวกับ)

ติ๊ก:
- [x] **Personally identifiable information** — name/email/address ในโปรไฟล์ (เก็บในเครื่อง; ส่วนที่จำเป็นอาจส่งตอน Pro AI fill / license)
- [x] **Website content** — อ่านข้อความ/ฟิลด์ฟอร์มบนหน้าเว็บเพื่อ autofill
- [x] **Web history** — ใช้เฉพาะนับโดเมนที่เข้าบ่อยสำหรับ new tab (ไม่ขาย)
- [x] **User activity** — จำกัดแค่การใช้งาน extension ที่จำเป็น (เช่น หน้าที่กำลังเปิดสำหรับ fill) — ถ้าฟอร์มแยก “clicks/keystroke logging” แบบสอดแนม **อย่าติ๊ก** ถ้าไม่มีช้อยส์ย่อยที่ตรง ให้ติ๊กเฉพาะที่อธิบายได้ใน policy

ไม่ติ๊ก:
- [ ] Health information
- [ ] Financial and payment information *(การจ่าย Pro อยู่ที่ Lemon บนเว็บ ไม่เก็บบัตรใน extension)*
- [ ] Authentication information *(ไม่เก็บรหัสผ่านเว็บ)*
- [ ] Personal communications
- [ ] Location *(ไม่ใช้ GPS)*

ถ้ามีช่อง “None of the above” และคุณมั่นใจว่า PII อยู่แค่ local-only โดยไม่ส่งเซิร์ฟเวอร์เลย จะไม่ตรงกับ Pro — **อย่าเลือก None** เพราะมี license + optional AI fill

---

## Certifications — ติ๊กครบ 3 ข้อ *

- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

---

## หลังกรอก

1. Save draft  
2. รอ https://www.ranasi.com/privacy เปิดได้  
3. ใส่ Privacy policy URL  
4. Submit for review  
