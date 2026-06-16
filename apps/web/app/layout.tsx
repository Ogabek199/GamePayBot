import '../styles/globals.css';
import { BottomNav } from '../components/BottomNav';
import TelegramAuth from '../components/TelegramAuth';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020D2B',
};

export const metadata = {
  title: 'GamePayBot - Premium Gaming Store',
  description: 'Fast and secure gaming topups',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
      <html lang="uz">
      <body className="bg-bg text-white min-h-dvh overflow-x-hidden" suppressHydrationWarning>
      <Toaster position="top-center" reverseOrder={false} containerStyle={{ zIndex: 9999999 }}/>
      <div className="flex min-h-screen">
        <TelegramAuth/>
        <BottomNav/>
        <main className="flex-1 overflow-y-auto bg-bg p-4 md:p-6 lg:p-8 pb-24 md:pb-0">
          <div className="max-w-5xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </body>
      </html>
  );
}
