import { z } from 'zod';
import { PRIVACY_TYPES, BOOKING_VISIBILITY_TYPES, GIFT_TAGS } from './types';

/**
 * Zod схемы для валидации данных вишлистов
 * Используются для безопасного парсинга данных из localStorage
 * Enum значения импортируются из types.ts для избежания дублирования (SSOT)
 */

// Enum схемы - используем константы из types.ts вместо хардкода
const privacyTypeSchema = z.enum(PRIVACY_TYPES);
const bookingVisibilityTypeSchema = z.enum(BOOKING_VISIBILITY_TYPES);
const giftTagSchema = z.enum(GIFT_TAGS);

/**
 * Схема для WishlistItem
 */
const wishlistItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().optional(),
  currency: z.string().optional(),
  imageUrl: z.string().optional(),
  link: z.string().optional(),
  description: z.string().optional(),
  isPurchased: z.boolean().optional(),
  purchasedBy: z.string().optional(),
  wishlistIds: z.array(z.string()),
  giftTag: giftTagSchema.optional(),
  category: z.array(z.string()).optional(),
  purchaseLocation: z.string().optional(),
});

/**
 * Схема для Wishlist с преобразованием строковых дат в Date объекты
 */
export const wishlistSchema = z.object({
  // VisualEntity
  id: z.string(),
  title: z.string(),
  imageUrl: z.string().optional(),
  
  // TimestampedEntity - строки преобразуются в Date
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  
  // Wishlist специфичные поля
  userId: z.string(),
  iconId: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  icon: z.string().optional(),
  itemCount: z.number().optional(),
  eventDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  privacy: privacyTypeSchema.optional(),
  bookingVisibility: bookingVisibilityTypeSchema.optional(),
  allowGroupGifting: z.boolean().optional(),
  favoriteCount: z.number().optional(),
  items: z.array(wishlistItemSchema).optional(),
});

/**
 * Схема для массива вишлистов
 */
export const wishlistsArraySchema = z.array(wishlistSchema);