import React from 'react';
import { BaseDrawer, RoundedButton, SelectList } from '@/shared/ui';
import { useTranslation, type Language } from '@/app';
import { LANGUAGE_OPTIONS } from '../config';

interface LanguageDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Language;
  onSelect: (language: Language) => void;
}

export function LanguageDrawer({ open, onOpenChange, selected, onSelect }: LanguageDrawerProps): JSX.Element {
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
      <RoundedButton onClick={() => onOpenChange(false)}>
        {t('common.close')}
      </RoundedButton>
    </BaseDrawer>
  );
}