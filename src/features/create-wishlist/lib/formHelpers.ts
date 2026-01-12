import type { Wishlist } from '../../../entities/wishlist';
import type { CreateWishlistForm } from '../model';
import { DEFAULT_ICON_ID } from '../config';

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
    privacy: wishlist.privacy || 'public',
    bookingVisibility: wishlist.bookingVisibility || 'show_names',
    allowGroupGifting: wishlist.allowGroupGifting ?? true,
  };
}