import React from 'react';
import { OptionSelectDrawer } from '../../../shared/ui/OptionSelectDrawer';
import { useTranslation } from '../../../shared/lib';
import { BOOKING_VISIBILITY_OPTIONS, type BookingVisibilityType } from '../config';
import type { BaseSelectProps } from '../../../shared/model';

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
