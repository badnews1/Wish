import { z } from 'zod';

/**
 * Zod схемы для валидации данных вишлистов
 * Используются для безопасного парсинга данных из localStorage
 */

// Enum схемы
const privacyTypeSchema = z.enum(['public', 'friends', 'selected', 'private']);
const bookingVisibilityTypeSchema = z.enum(['show_names', 'hide_names', 'hide_all']);
const giftTagSchema = z.enum(['none', 'really-want', 'would-be-nice', 'thinking', 'buy-myself']);

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
  iconId: z.string().optional(),
  description: z.string().optional(),
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
