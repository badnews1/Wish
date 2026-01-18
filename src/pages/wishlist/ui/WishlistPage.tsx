import React from 'react';
import { Header } from '@/widgets/header';
import { useTranslation } from '@/app';
import type { WishlistPageProps } from '../model';
import { WishlistGridCard } from './WishlistGridCard';
import { CreateWishlistCard } from './CreateWishlistCard';

export function WishlistPage({ wishlists, onWishlistClick, onCreateWishlist }: WishlistPageProps): JSX.Element {
  const { t, language } = useTranslation();

  return (
    <div className="flex flex-col bg-white pb-32 min-h-screen">
      <Header title={t('pages.wishlist.title')} />

      {/* Контент страницы */}
      <div className="p-4 flex-1 flex flex-col">
        {wishlists.length === 0 ? (
          // Empty state - показываем большую карточку создания
          <div className="flex flex-col items-center justify-center flex-1 px-6">
            <div className="w-full max-w-[200px]">
              <CreateWishlistCard 
                onClick={onCreateWishlist}
                t={t}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center mt-6">
              {t('pages.wishlist.emptyState.title')}
            </h3>
            <p className="text-gray-500 text-center max-w-xs">
              {t('pages.wishlist.emptyState.description')}
            </p>
          </div>
        ) : (
          // Сетка вишлистов (2 колонки)
          <div className="grid grid-cols-2 gap-x-3 gap-y-6">
            {wishlists.map((wishlist) => (
              <WishlistGridCard
                key={wishlist.id}
                wishlist={wishlist}
                onClick={() => onWishlistClick?.(wishlist.id)}
                t={t}
                language={language as 'ru' | 'en'}
              />
            ))}
            
            {/* Карточка создания нового вишлиста */}
            <CreateWishlistCard 
              onClick={onCreateWishlist}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
}