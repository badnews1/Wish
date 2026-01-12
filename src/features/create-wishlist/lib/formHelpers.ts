import type { Wishlist } from '@/entities/wishlist';
import { DEFAULT_PRIVACY, DEFAULT_BOOKING_VISIBILITY } from '@/entities/wishlist';
import type { CreateWishlistForm } from '../model';
import { DEFAULT_ICON_ID } from '@/shared/config';

/**
 * Конвертирует данные вишлиста в форму для редактирования
 */
export function wishlistToFormData(wishlist: Wishlist): CreateWishlistForm {
  return {
    title: wishlist.title,
    description: wishlist.description,
    iconId: wishlist.iconId || DEFAULT_ICON_ID,
    imageUrl: wishlist.imageUrl,
    eventDate: wishlist.eventDate,
    privacy: wishlist.privacy || DEFAULT_PRIVACY,
    bookingVisibility: wishlist.bookingVisibility || DEFAULT_BOOKING_VISIBILITY,
    allowGroupGifting: wishlist.allowGroupGifting ?? true,
  };
}