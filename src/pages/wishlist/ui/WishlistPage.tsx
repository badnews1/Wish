import React from 'react';
import { Header } from '../../../widgets/Header';
import { WishlistCard } from '../../../entities/wishlist';
import { useTranslation } from '../../../shared/lib/hooks';
import type { Wishlist } from '../../../entities/wishlist';
import type { WishlistPageProps } from '../model';

export function WishlistPage({ wishlists, onWishlistClick }: WishlistPageProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-white pb-32 min-h-screen">
      <Header title={t('pages.wishlist.title')} />

      {/* Контент страницы */}
      <div className="p-4 flex-1 flex flex-col">
        {wishlists.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center flex-1 px-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
              {t('pages.wishlist.emptyState.title')}
            </h3>
            <p className="text-gray-500 text-center max-w-xs">
              {t('pages.wishlist.emptyState.description')}
            </p>
          </div>
        ) : (
          // Grid with wishlists
          <div className="flex flex-col gap-3">
            {wishlists.map((wishlist) => (
              <WishlistCard
                key={wishlist.id}
                title={wishlist.title}
                imageUrl={wishlist.imageUrl}
                itemCount={wishlist.itemCount}
                eventDate={wishlist.eventDate}
                iconId={wishlist.iconId}
                variant="horizontal"
                onClick={() => onWishlistClick?.(wishlist.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}