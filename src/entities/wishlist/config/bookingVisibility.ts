import { Eye, EyeOff, UserX } from 'lucide-react';
import type { BookingVisibilityType } from '../model';
import { BOOKING_VISIBILITY_TYPES } from '../model';

/**
 * Дефолтное значение видимости бронирования для новых вишлистов
 */
export const DEFAULT_BOOKING_VISIBILITY: BookingVisibilityType = 'show_names';

export interface BookingVisibilityOption {
  id: BookingVisibilityType;
  labelKey: string;
  descriptionKey: string;
  icon: typeof Eye;
}

/**
 * Опции видимости бронирования
 * labelKey и descriptionKey используются для i18n (createWishlist.bookingVisibility.{id}.label/description)
 * Порядок элементов соответствует BOOKING_VISIBILITY_TYPES (SSOT)
 */
export const BOOKING_VISIBILITY_OPTIONS: BookingVisibilityOption[] = BOOKING_VISIBILITY_TYPES.map((id) => {
  // Маппинг иконок и i18n ключей для каждого типа видимости бронирования
  const config: Record<BookingVisibilityType, { icon: typeof Eye; labelKey: string; descriptionKey: string }> = {
    show_names: {
      icon: Eye,
      labelKey: 'createWishlist.bookingVisibility.show_names.label',
      descriptionKey: 'createWishlist.bookingVisibility.show_names.description',
    },
    hide_names: {
      icon: EyeOff,
      labelKey: 'createWishlist.bookingVisibility.hide_names.label',
      descriptionKey: 'createWishlist.bookingVisibility.hide_names.description',
    },
    hide_all: {
      icon: UserX,
      labelKey: 'createWishlist.bookingVisibility.hide_all.label',
      descriptionKey: 'createWishlist.bookingVisibility.hide_all.description',
    },
  };

  return {
    id,
    ...config[id],
  };
});