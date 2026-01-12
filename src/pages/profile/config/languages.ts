import type { Language } from '@/app';

/**
 * Опции выбора языка приложения
 */
export const LANGUAGE_OPTIONS = [
  {
    id: 'ru' as const,
    labelKey: 'language.russian',
    icon: '🇷🇺'
  },
  {
    id: 'en' as const,
    labelKey: 'language.english',
    icon: '🇬🇧'
  }
] as const;