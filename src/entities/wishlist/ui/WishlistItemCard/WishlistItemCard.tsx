import React from 'react';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { WishlistItem } from '../../model';
import { DEFAULT_CURRENCY } from '../../config';
import { getGiftTagLabel, getGiftTagStyles } from '../../lib';

interface WishlistItemCardProps {
  item: WishlistItem;
  onClick?: () => void;
  t: (key: string) => string; // Функция перевода передается извне
}

export function WishlistItemCard({ item, onClick, t }: WishlistItemCardProps) {
  return (
    <div 
      className="flex gap-4 items-start cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Изображение желания */}
      <div className="shrink-0">
        <div 
          className="w-24 h-24 rounded-[12px] overflow-hidden bg-gray-100"
        >
          {item.imageUrl ? (
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
          )}
        </div>
      </div>

      {/* Контент желания */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-[15px] leading-tight line-clamp-2">
            {item.title}
          </h3>
        </div>

        {/* Цена */}
        {item.price && (
          <p className="text-lg font-semibold text-gray-900 mb-2">
            {item.price} {item.currency || DEFAULT_CURRENCY}
          </p>
        )}

        {/* Метка подарка */}
        <div className="flex gap-2 items-center">
          {item.giftTag && item.giftTag !== 'none' && (
            <Badge 
              variant="secondary"
              className={`px-4 py-1.5 rounded-full text-sm border-0 ${getGiftTagStyles(item.giftTag).bg} ${getGiftTagStyles(item.giftTag).text}`}
            >
              {getGiftTagLabel(item.giftTag, t)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}