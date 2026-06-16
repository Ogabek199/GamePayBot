# Loyihadagi Muammolar va Kamchiliklar

Loyiha kodini o'rganish davomida quyidagi xatoliklar va kamchiliklar aniqlandi.

## 🔴 Kritik Muammolar (Build Failures)
1.  **Admin Build Xatosi:** `apps/admin` ilovasida `globals.css` fayli topilmadi. Bu ilovaning build bo'lishiga to'sqinlik qilmoqda.
2.  **Versiya Mos kelmasligi:** `apps/web` da Next.js 15 ishlatilgan, lekin React 18 o'rnatilgan. Next.js 15 to'liq ishlashi uchun React 19 tavsiya etiladi.

## 🟡 Konfiguratsiya va Xavfsizlik
3.  **Baza Turi:** Production uchun `sqlite` ishlatish xavfli (ma'lumotlar yo'qolishi va tezlik muammosi). PostgreSQL-ga o'tish shart.
4.  **Hardcoded Path:** `.env.example` faylida `DATABASE_URL` shaxsiy kompyuterdagi yo'lga (`/Users/macbookpro/...`) bog'lab qo'yilgan.
5.  **Exposed Secrets:** `.env.example` da real JWT_SECRET va Bot Tokenlari qolib ketgan. Bularni placeholder (masalan, `your_secret_here`) bilan almashtirish kerak.
6.  **Missing Env Variables:** Backend bot xizmatida `ADMIN_CHAT_ID` ishlatilgan, lekin u `.env.example` faylida ko'rsatilmagan.
7.  **Variable Name Mismatch:** `apps/web/services/api.ts` faylida `NEXT_PUBLIC_API_BASE_URL` ishlatilgan, lekin `.env.example` da `API_BASE_URL` deb ko'rsatilgan. Bu frontendning backendga bog'lana olmasligiga olib keladi.

## 🔵 Kod Sifati va Arxitektura
7.  **Admin Panel Minimalizm:** Admin panel juda oddiy holatda, ko'plab boshqaruv funksiyalari (masalan, paket qo'shish, o'yin tahrirlash) UI-da hali to'liq ko'rinmaydi.
8.  **Redundant Config:** `apps/web/next.config.mjs` da `experimental: { appDir: true }` qolib ketgan. Next.js 13+ dan boshlab bu standart va ortiqcha hisoblanadi.
9.  **Docker Yo'qligi:** Production deploymentni osonlashtirish uchun Dockerfile va docker-compose fayllari mavjud emas.

## ✅ Tavsiyalar
- Admin panel uchun `globals.css` yaratish yoki `layout.tsx` dan importni olib tashlash.
- `prisma/schema.prisma` da providerni `postgresql` ga o'zgartirish.
- `package.json` lardagi React versiyalarini Next.js versiyasiga moslash.
- Production uchun maxsus `.env.production` faylini tayyorlash.
