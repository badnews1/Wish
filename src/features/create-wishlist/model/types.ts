import type { PrivacyType } from '../config';
import type { BookingVisibilityType } from '../config';

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