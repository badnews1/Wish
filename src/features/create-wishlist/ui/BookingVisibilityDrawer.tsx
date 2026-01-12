import React from 'react';
import { OptionSelectDrawer } from '@/shared/ui/OptionSelectDrawer';
import { useTranslation } from '@/app';
import { BOOKING_VISIBILITY_OPTIONS } from '@/entities/wishlist';
import type { BookingVisibilityType } from '@/entities/wishlist';
import type { BaseSelectProps } from '@/shared/model';

interface BookingVisibilityDrawerProps extends BaseSelectProps<BookingVisibilityType> {}

export function BookingVisibilityDrawer({ open, onOpenChange, selected, onSelect }: BookingVisibilityDrawerProps) {
  const { t } = useTranslation();
  
  // Преобразуем опции с переведенными текстами
  const translatedOptions = BOOKING_VISIBILITY_OPTIONS.map(option => ({
    ...option,
    label: t(option.labelKey),
    description: t(option.descriptionKey)
  }));
  
  return (
    <OptionSelectDrawer
      open={open}
      onOpenChange={onOpenChange}
      options={translatedOptions}
      selected={selected}
      onSelect={onSelect}
      title={t('createWishlist.ui.bookingVisibilityDrawerTitle')}
    />
  );
}