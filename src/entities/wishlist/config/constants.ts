export const WISHLIST_ASPECT_RATIO = '3/4';
export const WISHLIST_ASPECT_RATIO_HORIZONTAL = '5/2';

export const WISHLIST_VARIANTS = {
  vertical: 'vertical',
  horizontal: 'horizontal',
} as const;

export type WishlistVariant = typeof WISHLIST_VARIANTS[keyof typeof WISHLIST_VARIANTS];

/**
 * Ключ для хранения вишлистов в localStorage
 */
export const WISHLIST_STORAGE_KEY = 'wishlists';

/**
 * Валюта по умолчанию для отображения цены
 */
export const DEFAULT_CURRENCY = '$';