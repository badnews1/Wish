import type { VisualEntity, TimestampedEntity } from '@/shared/model';

/**
 * Константные массивы для enum типов - SINGLE SOURCE OF TRUTH
 * Используются для вывода типов и для zod валидации в schemas.ts
 */

export const PRIVACY_TYPES = ['public', 'friends', 'selected', 'private'] as const;
export const BOOKING_VISIBILITY_TYPES = ['show_names', 'hide_names', 'hide_all'] as const;
export const GIFT_TAGS = ['none', 'really-want', 'would-be-nice', 'thinking', 'buy-myself'] as const;

/**
 * Тип приватности вишлиста
 */
export type PrivacyType = typeof PRIVACY_TYPES[number];

/**
 * Тип видимости бронирования
 */
export type BookingVisibilityType = typeof BOOKING_VISIBILITY_TYPES[number];

/**
 * Метка подарка (gift tag)
 */
export type GiftTag = typeof GIFT_TAGS[number];

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
  userId: string; // ID владельца вишлиста
  iconId?: string;
  description?: string;
  coverImage?: string; // URL обложки из Supabase Storage
  icon?: string; // Emoji иконка
  itemCount?: number;
  eventDate?: Date;
  privacy?: PrivacyType;
  bookingVisibility?: BookingVisibilityType;
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
  privacy: PrivacyType;
  bookingVisibility: BookingVisibilityType;
  allowGroupGifting: boolean;
}

/**
 * Данные для создания/обновления желания
 */
export type WishlistItemInput = Omit<WishlistItem, 'id' | 'isPurchased' | 'purchasedBy' | 'wishlistIds'>;