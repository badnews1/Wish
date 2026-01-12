import React from 'react';
import type { HeaderProps } from '../model';

export function Header({ 
  title, 
  titleAlign = 'center',
  leftAction,
  rightAction,
  className = ''
}: HeaderProps) {
  const isCenter = titleAlign === 'center';

  return (
    <header className={`sticky top-0 z-10 bg-white px-4 pt-6 pb-4 ${className}`}>
      <div className="relative flex items-center justify-between">
        {/* Левая часть */}
        <div className="flex items-center gap-4 flex-shrink-0 min-h-9">
          {leftAction}
        </div>

        {/* Заголовок */}
        <h1 
          className={`text-xl font-bold text-foreground ${
            isCenter ? 'absolute left-1/2 -translate-x-1/2' : ''
          }`}
        >
          {title}
        </h1>

        {/* Правая часть */}
        <div className="flex items-center gap-2 flex-shrink-0 min-h-9">
          {rightAction}
        </div>
      </div>
    </header>
  );
}