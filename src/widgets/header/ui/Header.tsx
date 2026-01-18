import React from 'react';
import { ImageOverlay } from '@/shared/ui';
import type { HeaderProps } from '../model';

export function Header({ 
  title, 
  titleAlign = 'left',
  leftAction,
  rightAction,
  variant = 'default',
  imageUrl,
  imageAlt = '',
  backgroundColor,
  height = '16rem',
  emptyStateContent,
  bottomOverlayElements,
  className = ''
}: HeaderProps): JSX.Element {
  // Overlay вариант - header над изображением
  if (variant === 'overlay') {
    const overlayElements = [
      {
        element: leftAction,
        position: 'top-left' as const
      },
      {
        element: rightAction,
        position: 'top-right' as const
      }
    ];

    // Добавляем нижние элементы, если есть
    if (bottomOverlayElements) {
      overlayElements.push({
        element: bottomOverlayElements,
        position: 'bottom-left' as const
      });
    }

    return (
      <ImageOverlay
        imageUrl={imageUrl}
        alt={imageAlt}
        backgroundColor={backgroundColor}
        height={height}
        rounded="lg"
        className={`rounded-t-none ${className}`}
        emptyStateContent={emptyStateContent}
        overlayElements={overlayElements}
      />
    );
  }

  // Default вариант - обычный header с белым фоном
  const isCenter = titleAlign === 'center';

  return (
    <header className={`sticky top-0 z-10 bg-white px-4 pt-6 pb-4 ${className}`}>
      <div className="relative flex items-center">
        {/* Левая часть */}
        <div className="flex items-center gap-4 flex-shrink-0 min-h-9">
          {leftAction}
          {/* Заголовок слева - сразу после leftAction */}
          {!isCenter && title && (
            <h1 className="text-xl font-bold text-foreground">
              {title}
            </h1>
          )}
        </div>

        {/* Заголовок по центру - абсолютное позиционирование */}
        {isCenter && title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-foreground">
            {title}
          </h1>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-2 flex-shrink-0 min-h-9 ml-auto">
          {rightAction}
        </div>
      </div>
    </header>
  );
}