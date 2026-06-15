'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.back()} 
      className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted hover:text-white transition-colors"
    >
      <ChevronLeft size={20} />
    </button>
  );
}
