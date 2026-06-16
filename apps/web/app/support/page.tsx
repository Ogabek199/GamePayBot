'use client';

import React from 'react';
import { ChevronLeft, MessageCircle, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen animate-fade-in p-4 md:p-6 pb-10 max-w-4xl mx-auto flex flex-col justify-between">
      {/* Header qismi */}
      <header className="flex items-center justify-between w-full pt-2">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-muted hover:text-white transition-colors active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-sm font-semibold tracking-wide text-muted uppercase">Yordam Markazi</h1>
        <div className="w-10 h-10" /> {/* Simmetriya uchun bo'sh joy */}
      </header>

      {/* Markaziy kontent bo'limi */}
      <section className="flex-1 flex flex-col justify-center items-center text-center space-y-8 my-auto">
        {/* Asosiy animatsion ikonka */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-lg relative animate-bounce [animation-duration:3s]">
            <MessageCircle size={40} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          </div>
        </div>

        {/* Matnlar */}
        <div className="space-y-2 px-4">
          <h2 className="text-2xl font-black tracking-tight">Qo'llab-quvvatlash</h2>
          <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
            Savollaringiz yoki takliflaringiz bormi? Biz bilan bevosita Telegram orqali bog'laning.
          </p>
        </div>
      </section>

      {/* Pastki Harakat Tugmasi (Call to Action) */}
      <footer className="w-full">
        <a
          href="https://t.me/otaxonov_o17"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full glass-card p-5 flex items-center justify-between border border-primary/30 bg-primary/5 rounded-2xl hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 active:scale-[0.98] group shadow-xl"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Send size={22} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Telegram Chat</p>
              <p className="font-bold text-base text-white">@otaxonov_o17</p>
            </div>
          </div>

          {/* Tugma ichidagi kichik yo'naltiruvchi strelka */}
          <div className="text-primary group-hover:translate-x-1 transition-transform">
            <ChevronLeft size={20} className="rotate-180" />
          </div>
        </a>
      </footer>
    </main>
  );
}
