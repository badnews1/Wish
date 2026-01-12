import type { GiftTag } from '@/entities/wishlist';

/**
 * Форма создания/редактирования элемента вишлиста
 */
export interface CreateWishlistItemForm {
  title: string;
  description?: string;
  price?: number;
  currency: string;
  imageUrl?: string;
  additionalImages?: string[];
  productUrl?: string;
  purchaseLocation?: string;
  giftTag?: GiftTag;
  category?: string[];
  size?: string;
  color?: string;
  brand?: string;
  wishlistIds?: string[]; // ID вишлистов, в которые добавляется товар
}