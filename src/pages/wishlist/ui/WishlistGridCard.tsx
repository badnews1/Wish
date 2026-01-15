import React from 'react';
import { Card } from '@/components/ui/card';
import { WISHLIST_ICONS } from '@/shared/config';
import { formatDate } from '@/shared/lib';
import type { Wishlist } from '@/entities/wishlist';

interface WishlistGridCardProps {
  wishlist: Wishlist;
  onClick?: () => void;
  t: (key: string) => string;
  language?: 'ru' | 'en';
}

/**
 * Карточка вишлиста с сеткой фотографий для страницы списка вишлистов
 * 
 * Отображает:
 * - Сетку из 1-3 фотографий желаний (1 большая сверху + 2 маленькие снизу)
 * - Бейдж с количеством желаний справа сверху
 * - Иконку, название и дату события под карточкой
 * - Пустую карточку если нет желаний
 */
export function WishlistGridCard({ wishlist, onClick, t, language = 'ru' }: WishlistGridCardProps) {
  // Получаем обложку и фотографии желаний отдельно
  const coverImage = wishlist.imageUrl;
  const wishPhotos = React.useMemo(() => {
    if (!wishlist.items) return [];
    return wishlist.items
      .filter(item => item.imageUrl)
      .map(item => item.imageUrl!);
  }, [wishlist.items]);

  // Находим иконку по iconId
  const iconData = wishlist.iconId ? WISHLIST_ICONS.find(icon => icon.id === wishlist.iconId) : null;

  const itemCount = wishlist.itemCount ?? 0;

  return (
    <div onClick={onClick} className="cursor-pointer">
      {/* Карточка с фотографиями */}
      <Card className="overflow-hidden active:scale-95 transition-transform border border-gray-200 p-0">
        {/* Сетка фотографий или пустое состояние */}
        <div className="relative bg-gray-100 aspect-[3/4]">
          {coverImage ? (
            // Если есть обложка - делим карточку на 2 части
            <div className="absolute inset-0 grid grid-rows-2 gap-0.5">
              {/* Верхняя часть - обложка */}
              <img 
                src={coverImage} 
                alt="" 
                className="w-full h-full object-cover"
              />
              
              {/* Нижняя часть - фото желаний или пустое состояние */}
              {wishPhotos.length === 0 ? (
                // Пустое состояние
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">{t('pages.wishlist.emptyWishlist.text')}</span>
                </div>
              ) : wishPhotos.length === 1 ? (
                // 1 фото желания
                <img 
                  src={wishPhotos[0]} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                // 2+ фото желаний - делим нижнюю часть пополам
                <div className="grid grid-cols-2 gap-0.5">
                  <img 
                    src={wishPhotos[0]} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <img 
                    src={wishPhotos[1]} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ) : (
            // Если нет обложки - отображаем фото желаний
            <>
              {wishPhotos.length === 0 ? (
                // Пустое состояние - нет желаний
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">{t('pages.wishlist.emptyWishlist.text')}</span>
                </div>
              ) : wishPhotos.length === 1 ? (
                // 1 фотография - на весь размер
                <img 
                  src={wishPhotos[0]} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : wishPhotos.length === 2 ? (
                // 2 фотографии - делим пополам вертикально
                <div className="absolute inset-0 grid grid-rows-2 gap-0.5">
                  <img 
                    src={wishPhotos[0]} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <img 
                    src={wishPhotos[1]} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // 3 фотографии - 1 большая сверху + 2 маленькие снизу
                <div className="absolute inset-0 grid grid-rows-2 gap-0.5">
                  <img 
                    src={wishPhotos[0]} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="grid grid-cols-2 gap-0.5">
                    <img 
                      src={wishPhotos[1]} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    <img 
                      src={wishPhotos[2]} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Бейдж с количеством желаний */}
          {itemCount > 0 && (
            <div className="absolute top-2 right-2 bg-[var(--color-accent)] text-white rounded-full min-w-[28px] h-7 px-2 flex items-center justify-center text-xs font-semibold shadow-lg">
              {itemCount}
            </div>
          )}
        </div>
      </Card>

      {/* Информация о вишлисте под карточкой */}
      <div className="mt-2 px-1">
        <div className="flex items-center gap-2">
          {/* Иконка вишлиста */}
          {iconData?.emoji && (
            <span className="text-base leading-none flex-shrink-0">{iconData.emoji}</span>
          )}
          
          {/* Название */}
          <h3 className="font-semibold text-sm text-gray-900 flex-1 truncate">
            {wishlist.title}
          </h3>
        </div>
        
        {/* Дата события */}
        {wishlist.eventDate && (
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(wishlist.eventDate, language)}
          </p>
        )}
      </div>
    </div>
  );
}