import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import { Badge } from '../../../../components/ui/badge';
import type { WishlistItem } from '../../model';
import { DEFAULT_CURRENCY } from '../../config';
import { getGiftTagLabel, getGiftTagStyles } from '../../lib';
import { useTranslation } from '../../../../shared/lib';

interface WishlistItemCardProps {
  item: WishlistItem;
  onClick?: () => void;
}

export function WishlistItemCard({ item, onClick }: WishlistItemCardProps) {
  const { t, language } = useTranslation();
  
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="flex overflow-hidden bg-white rounded-2xl border border-gray-100 cursor-pointer hover:border-gray-200 transition-colors"
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' }}
      onClick={onClick}
    >
      {/* Изображение товара - прилегает к левому краю */}
      <div className="flex-shrink-0 w-32 bg-gray-50">
        {item.imageUrl ? (
          <ImageWithFallback
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">{t('wishlist.card.noImage')}</span>
          </div>
        )}
      </div>

      {/* Информация о товаре */}
      <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
        {/* Верхняя часть: название и описание */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          {item.description && (
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {/* Нижняя часть: цена, ссылка и статус */}
        <div className="flex flex-col gap-2">
          {/* Цена и ссылка */}
          {(item.price || item.link) && (
            <div className="flex items-center gap-3">
              {item.price && (
                <span className="text-lg font-semibold text-gray-900">
                  {item.currency || DEFAULT_CURRENCY}{item.price}
                </span>
              )}
              {item.link && (
                <button
                  onClick={handleLinkClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[--color-accent] hover:bg-purple-50 transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{t('wishlist.card.linkButton')}</span>
                </button>
              )}
            </div>
          )}

          {/* Бейдж статуса/метки */}
          <div className="flex items-center gap-2">
            {/* Статус куплено/актуально */}
            <Badge 
              variant={item.isPurchased ? "secondary" : "outline"}
              className={`px-4 py-1.5 rounded-full text-sm border-0 ${
                item.isPurchased 
                  ? 'bg-gray-100 text-gray-600' 
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {item.isPurchased ? t('wishlist.card.statusPurchased') : t('wishlist.card.statusAvailable')}
            </Badge>

            {/* Метка подарка (если установлена и не "Без метки") */}
            {item.giftTag && item.giftTag !== 'none' && (
              <Badge 
                variant="secondary"
                className={`px-4 py-1.5 rounded-full text-sm border-0 ${getGiftTagStyles(item.giftTag).bg} ${getGiftTagStyles(item.giftTag).text}`}
              >
                {getGiftTagLabel(item.giftTag, language)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}