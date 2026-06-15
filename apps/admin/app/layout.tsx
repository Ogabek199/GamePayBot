import './globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-bg text-white">{children}</body>
    </html>
  );
}
