import React from 'react';
import { OptionSelectDrawer } from '../../../shared/ui/OptionSelectDrawer';
import { useTranslation } from '../../../shared/lib';
import { PRIVACY_OPTIONS, type PrivacyType } from '../config';
import type { BaseSelectProps } from '../../../shared/model';

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
