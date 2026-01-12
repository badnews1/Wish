import { useTranslation } from '@/app';
import type { Wishlist } from '../../../entities/wishlist';
import type { ItemWishlistsProps } from '../model';

/**
 * Список вишлистов, к которым относится товар
 */
export function ItemWishlists({ wishlists, onWishlistClick }: ItemWishlistsProps) {
  const { t } = useTranslation();

  if (wishlists.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 px-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('pages.wishlistItemDetail.sections.wishlists')}</h2>
      <div className="space-y-2">
        {wishlists.map((wishlist) => (
          <button
            key={wishlist.id}
            onClick={() => onWishlistClick?.(wishlist.id)}
            className="w-full flex items-center gap-3 p-4 bg-gray-50 rounded-2xl active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl">{wishlist.iconId}</span>
            <span className="text-base font-medium text-gray-900">{wishlist.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}