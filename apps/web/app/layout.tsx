import '../styles/globals.css';
import { BottomNav } from '../components/BottomNav';
import TelegramAuth from '../components/TelegramAuth';
import { Toaster } from 'react-hot-toast';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata = {
  title: 'Gang Pay - Premium Gaming Store',
  description: 'Fast and secure gaming topups',
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
      <html lang="uz" className="bg-bg">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer/>
        <meta name="theme-color" content="#020D2B"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <title/>
      </head>
      <body className="bg-bg text-white min-h-dvh overflow-x-hidden" suppressHydrationWarning>
      <Toaster position="top-center" reverseOrder={false}/>
      <div className="flex min-h-screen">
        <TelegramAuth/>
        <BottomNav/>
        <main className="flex-1 overflow-y-auto bg-bg p-4 md:p-6 lg:p-8 pb-24 md:pb-0">
          <div className="max-w-5xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
      </body>
      </html>
  );
}
