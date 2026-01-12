import type { VisualEntity, TimestampedEntity } from '../../../shared/model';

/**
 * Метка подарка (gift tag)
 */
export type GiftTag = 'none' | 'really-want' | 'would-be-nice' | 'thinking' | 'buy-myself';

export interface WishlistItem {
  id: string;
  title: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  link?: string;
  description?: string;
  isPurchased?: boolean;
  purchasedBy?: string;
  wishlistIds: string[]; // Массив ID вишлистов, в которых находится это желание
  giftTag?: GiftTag; // Метка подарка
  category?: string[]; // Массив категорий товара (до 3 штук)
  purchaseLocation?: string; // Адрес физического магазина
}

export interface Wishlist extends VisualEntity, TimestampedEntity {
  iconId?: string;
  description?: string;
  itemCount?: number;
  eventDate?: Date;
  privacy?: string;
  bookingVisibility?: string;
  allowGroupGifting?: boolean;
  favoriteCount?: number;
  items?: WishlistItem[];
}

/**
 * Данные для создания/обновления вишлиста
 */
export interface WishlistInput {
  title: string;
  description?: string;
  iconId: string;
  imageUrl?: string;
  eventDate?: Date;
  privacy: string;
  bookingVisibility: string;
  allowGroupGifting: boolean;
}

/**
 * Данные для создания/обновления желания
 */
export type WishlistItemInput = Omit<WishlistItem, 'id' | 'isPurchased' | 'purchasedBy' | 'wishlistIds'>;