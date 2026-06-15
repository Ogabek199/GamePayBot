'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Wallet, Clock, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Bosh sahifa', icon: LayoutGrid, path: '/' },
  { name: 'Hamyon', icon: Wallet, path: '/wallet' },
  { name: 'Tarix', icon: Clock, path: '/history' },
  { name: 'Profil', icon: User, path: '/profile' },
];

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto h-16 glass rounded-[9999px] shadow-premium flex items-center justify-around px-4 premium-border pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative",
                isActive ? "text-primary" : "text-muted hover:text-white"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,196,0,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
