# Production Deployment Guide - GangPangBotClone

Loyihani productionga (haqiqiy foydalanuvchilar uchun) chiqarish uchun quyidagi xizmatlar va xarajatlar talab etiladi.

## 1. Asosiy xarajatlar (Oylik/Yillik)

| Xizmat turi | Tavsiya etilgan provayder | Taxminiy narx | Izoh |
| :--- | :--- | :--- | :--- |
| **Server (VPS)** | DigitalOcean / Hetzner / Timeweb | $5 - $15 / oy | Backend va Frontendlarni joylashtirish uchun. |
| **Ma'lumotlar bazasi** | Managed PostgreSQL (yoki VPS ichida) | $0 - $15 / oy | VPS ichida tekin, lekin xavfsizlik uchun managed tavsiya etiladi. |
| **Domen nomi** | Regos.uz / GoDaddy / Namecheap | $10 - $25 / yil | `.uz` yoki `.com` domen uchun. |
| **Redis** | Upstash / VPS ichida | $0 - $10 / oy | Kesh va sessiyalar uchun (agar ishlatilsa). |
| **SSL Sertifikat** | Cloudflare / Let's Encrypt | Bepul | HTTPS xavfsiz ulanish uchun. |

## 2. Tranzaksiya komissiyalari
Agar loyihada to'lov tizimlari (Click, Payme, Uzum) ulansa, har bir muvaffaqiyatli tranzaksiyadan provayderlar **2% dan 3% gacha** komissiya oladi.

## 3. Productionga tayyorgarlik bosqichlari
1.  **PostgreSQL-ga o'tish:** Hozirgi SQLite bazasini PostgreSQL-ga almashtirish kerak.
2.  **Environment Variables:** `.env` faylini production serverga moslab sozlash (Secrets, API keys).
3.  **CI/CD:** GitHub Actions orqali avtomatik deploymentni yo'lga qo'yish (ixtiyoriy, lekin tavsiya etiladi).
4.  **Process Manager:** Backendni doimiy ishlab turishi uchun `pm2` dan foydalanish.
5.  **Reverse Proxy:** Nginx orqali portlarni yo'naltirish (Backend: 4000, Web: 3000, Admin: 3001).

---
*Eslatma: Narxlar tanlangan tarif rejasi va provayderga qarab o'zgarishi mumkin.*
