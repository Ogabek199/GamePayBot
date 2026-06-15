import '../styles/globals.css';
import { BottomNav } from '../components/BottomNav';
import TelegramAuth from '../components/TelegramAuth';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Gang Pay - Premium Gaming Store',
  description: 'Fast and secure gaming topups',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="bg-bg">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer></script>
        <meta name="theme-color" content="#020D2B" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-bg text-white min-h-dvh pb-24 md:pb-0 overflow-x-hidden">
        <Toaster position="top-center" reverseOrder={false} />
        <TelegramAuth />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
