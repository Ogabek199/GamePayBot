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
    <>
      {/* Mobile Bottom Navigation */}
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 px-4 z-50 pointer-events-none bg-gradient-to-t from-bg via-bg to-transparent pt-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <nav className="w-full max-w-md mx-auto h-16 glass rounded-[9999px] shadow-premium flex items-center justify-around px-4 premium-border pointer-events-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 transition-all duration-300 relative flex-1",
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

      {/* Desktop Side Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 glass flex-col items-center lg:items-start justify-start pt-8 lg:p-8 gap-4 lg:gap-6 z-40 premium-border border-r border-l-0">
        <div className="text-primary font-bold text-2xl lg:text-3xl mb-8">
          GP
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center justify-center lg:justify-start lg:px-4 lg:py-3 rounded-xl transition-all duration-300 relative group w-12 lg:w-full",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="hidden lg:inline text-sm font-medium ml-4">{item.name}</span>
              {isActive && (
                <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_8px_rgba(255,196,0,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
