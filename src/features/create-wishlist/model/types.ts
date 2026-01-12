import type { PrivacyType, BookingVisibilityType } from '@/entities/wishlist';

export interface CreateWishlistForm {
  title: string;
  description?: string;
  iconId: string;
  imageUrl?: string;
  eventDate?: Date;
  privacy: PrivacyType;
  bookingVisibility: BookingVisibilityType;
  allowGroupGifting: boolean;
}