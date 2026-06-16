# Loyiha Haqida Ma'lumot - GangPangBotClone

Ushbu loyiha o'yinlar uchun paketlarni sotib olish imkonini beruvchi Telegram Web App va boshqaruv tizimidan iborat.

## 🚀 Texnologiyalar (Tech Stack)

### 1. Backend
- **Framework:** NestJS (Node.js)
- **Database ORM:** Prisma
- **Telegram Bot:** Telegraf.js
- **Xavfsizlik:** JWT (JSON Web Token), Helmet, CORS
- **Validatsiya:** class-validator, class-transformer

### 2. Frontend (Web App & Admin)
- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📂 Loyiha Strukturasi (Monorepo)
Loyiha NPM Workspaces yordamida monorepo sifatida tuzilgan:
- `/apps/web`: Foydalanuvchilar uchun asosiy Telegram Web App interfeysi.
- `/apps/admin`: Adminlar uchun boshqaruv paneli.
- `/backend`: Barcha biznes mantiq va API xizmatlari.
- `/prisma`: Ma'lumotlar bazasi sxemasi va migratsiyalar.

## 🛠 Asosiy Funksiyalar
- **Telegram Auth:** Foydalanuvchilarni Telegram orqali avtomatik autentifikatsiya qilish.
- **O'yinlar do'koni:** O'yin paketlarini ko'rish va tanlash.
- **Hamyon tizimi:** Balansni to'ldirish (Manual Card, Click, Payme).
- **Buyurtmalar tarixi:** Barcha xaridlar va to'lovlar tarixini kuzatish.
- **Admin Panel:** O'yinlarni, paketlarni va foydalanuvchi buyurtmalarini boshqarish.
- **Bildirishnomalar:** To'lov tasdiqlanganda yoki buyurtma bajarilganda bot orqali xabar yuborish.

---
*Loyiha Next.js va NestJS-ning eng so'nggi imkoniyatlaridan foydalangan holda qurilgan.*
