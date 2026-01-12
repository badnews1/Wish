import type { Wishlist } from '../../../entities/wishlist';
import type { CreateWishlistForm } from '../model';

/**
 * Конвертирует данные вишлиста в форму для редактирования
 */
export function wishlistToFormData(wishlist: Wishlist): CreateWishlistForm {
  return {
    title: wishlist.title,
    description: wishlist.description,
    iconId: wishlist.iconId,
    imageUrl: wishlist.imageUrl,
    eventDate: wishlist.eventDate,
    privacy: wishlist.privacy,
    bookingVisibility: wishlist.bookingVisibility,
    allowGroupGifting: wishlist.allowGroupGifting,
  };
}