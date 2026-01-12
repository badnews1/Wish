import type { Language } from '@/app';

/**
 * Опция выбора языка
 */
export type LanguageOption = {
  readonly id: Language;
  readonly labelKey: string;
  readonly icon: string;
};
