import React from 'react';
import { Card } from '../../../../components/ui/card';
import { WISHLIST_ASPECT_RATIO, WISHLIST_ASPECT_RATIO_HORIZONTAL } from '../../config';
import type { WishlistVariant } from '../../config';
import { WISHLIST_ICONS } from '../../../../shared/config';
import { formatItemCount } from '../../lib';
import { formatDate } from '../../../../shared/lib';

interface WishlistCardProps {
  title: string;
  onClick?: () => void;
  imageUrl?: string;
  imageComponent?: React.ReactNode;
  itemCount?: number;
  eventDate?: Date;
  variant?: WishlistVariant;
  iconId?: string;
  t: (key: string) => string; // Функция перевода передается извне
  language?: 'ru' | 'en'; // Язык для форматирования дат
}

export function WishlistCard({ title, onClick, itemCount, eventDate, variant = 'vertical', iconId, t, language = 'ru' }: WishlistCardProps) {
  const aspectRatio = variant === 'horizontal' ? WISHLIST_ASPECT_RATIO_HORIZONTAL : WISHLIST_ASPECT_RATIO;
  
  // Находим иконку по iconId
  const iconData = iconId ? WISHLIST_ICONS.find(icon => icon.id === iconId) : null;
  const IconComponent = iconData?.icon;

  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden active:scale-95 transition-transform cursor-pointer border-0 flex flex-col p-4"
      style={{ aspectRatio, backgroundColor: 'var(--color-accent)' }}
    >
      {/* Текст с иконкой */}
      <div className="flex items-start gap-3">
        {/* Иконка слева */}
        {IconComponent && (
          <div className="flex-shrink-0 w-14 rounded-xl bg-white/20 flex items-center justify-center p-3">
            <IconComponent size={32} strokeWidth={2} className="text-white" />
          </div>
        )}
        
        {/* Текст справа */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h2 className="font-semibold text-white">{title}</h2>
          {(eventDate || itemCount !== undefined) && (
            <div className="flex items-center gap-2 text-white/80 text-sm">
              {eventDate && <span>{formatDate(eventDate as Date, language)}</span>}
              {eventDate && itemCount !== undefined && <span>•</span>}
              {itemCount !== undefined && <span>{formatItemCount(itemCount, t, language)}</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}