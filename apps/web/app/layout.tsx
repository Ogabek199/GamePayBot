import '../styles/globals.css';
import { BottomNav } from '../components/BottomNav';
import TelegramAuth from '../components/TelegramAuth';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Gang Pay - Premium Gaming Store',
  description: 'Fast and secure gaming topups',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer></script>
      </head>
      <body className="bg-bg text-white min-h-screen pb-24">
        <Toaster position="top-center" reverseOrder={false} />
        <TelegramAuth />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
