import React from 'react';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface CreateWishlistCardProps {
  onClick?: () => void;
  t: (key: string) => string;
}

/**
 * Карточка для создания нового вишлиста
 * 
 * Отображается в конце списка вишлистов с кнопкой "+"
 */
export function CreateWishlistCard({ onClick, t }: CreateWishlistCardProps) {
  return (
    <Card 
      onClick={onClick}
      className="overflow-hidden active:scale-95 transition-transform cursor-pointer border-2 border-dashed border-gray-300 bg-white p-0 aspect-[3/4] flex items-center justify-center hover:border-gray-400 hover:bg-gray-50"
    >
      <div className="flex flex-col items-center justify-center gap-2 px-3">
        {/* Кнопка + */}
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Plus size={24} className="text-gray-600" strokeWidth={2} />
        </div>
        
        {/* Текст */}
        <span className="text-xs font-medium text-gray-600 text-center leading-tight">
          {t('pages.wishlist.createCard.title')}
        </span>
      </div>
    </Card>
  );
}