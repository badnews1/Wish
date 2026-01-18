import React from 'react';
import { useTranslation } from '@/app';
import { PRIVACY_OPTIONS } from '@/entities/wishlist';
import type { PrivacyType } from '@/entities/wishlist';
import { OptionSelectDrawer } from '@/shared/ui/OptionSelectDrawer';
import type { BaseSelectProps } from '@/shared/model';

interface PrivacySelectDrawerProps extends BaseSelectProps<PrivacyType> {}

export function PrivacySelectDrawer({ open, onOpenChange, selected, onSelect }: PrivacySelectDrawerProps) {
  const { t } = useTranslation();
  
  // Преобразуем опции с переведенными текстами
  const translatedOptions = PRIVACY_OPTIONS.map(option => ({
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
      title={t('createWishlist.ui.privacyDrawerTitle')}
    />
  );
}