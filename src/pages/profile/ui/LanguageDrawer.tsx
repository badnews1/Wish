import React from 'react';
import { BaseDrawer } from '@/shared/ui';
import { SelectList } from '@/shared/ui';
import { useTranslation } from '@/shared/lib';
import type { Language } from '@/app';
import { LANGUAGE_OPTIONS } from '../config';

interface LanguageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Language;
  onSelect: (language: Language) => void;
}

export function LanguageDrawer({ open, onOpenChange, selected, onSelect }: LanguageDrawerProps) {
  const { t } = useTranslation();
  
  const handleSelect = (languageId: string) => {
    onSelect(languageId as Language);
    onOpenChange(false);
  };

  // Преобразуем опции с переводом label
  const translatedOptions = LANGUAGE_OPTIONS.map(option => ({
    id: option.id,
    label: t(option.labelKey),
    icon: option.icon
  }));

  return (
    <BaseDrawer open={open} onOpenChange={onOpenChange} title={t('language.select')}>
      <SelectList
        mode="single"
        options={translatedOptions}
        selected={selected}
        onSelect={handleSelect}
      />
    </BaseDrawer>
  );
}