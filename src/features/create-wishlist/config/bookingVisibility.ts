import { Eye, EyeOff, UserX } from 'lucide-react';

export type BookingVisibilityType = 'show_names' | 'hide_names' | 'hide_all';

export interface BookingVisibilityOption {
  id: BookingVisibilityType;
  labelKey: string;
  descriptionKey: string;
  icon: typeof Eye;
}

/**
 * Опции видимости бронирования
 * labelKey и descriptionKey используются для i18n (createWishlist.bookingVisibility.{id}.label/description)
 */
export const BOOKING_VISIBILITY_OPTIONS: BookingVisibilityOption[] = [
  {
    id: 'show_names',
    labelKey: 'createWishlist.bookingVisibility.show_names.label',
    descriptionKey: 'createWishlist.bookingVisibility.show_names.description',
    icon: Eye,
  },
  {
    id: 'hide_names',
    labelKey: 'createWishlist.bookingVisibility.hide_names.label',
    descriptionKey: 'createWishlist.bookingVisibility.hide_names.description',
    icon: EyeOff,
  },
  {
    id: 'hide_all',
    labelKey: 'createWishlist.bookingVisibility.hide_all.label',
    descriptionKey: 'createWishlist.bookingVisibility.hide_all.description',
    icon: UserX,
  },
];
