import React from 'react';

export default function FloatingNav(){
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-card/80 backdrop-blur-md px-4 py-2 rounded-full shadow-xl">
      <ul className="flex gap-6 items-center">
        <li>🏠</li>
        <li>💼</li>
        <li>🕒</li>
        <li>👤</li>
      </ul>
    </nav>
  );
}
