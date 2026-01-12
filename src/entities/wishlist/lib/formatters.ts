import { getTranslation } from '@/app/config/i18n';
import type { Language } from '../../../app';

/**
 * Форматирует количество желаний с правильным склонением
 */
export function formatItemCount(count: number, language: Language = 'ru'): string {
  if (language === 'en') {
    const word = count === 1 
      ? getTranslation('en', 'wishlist.itemCount.one')
      : getTranslation('en', 'wishlist.itemCount.other');
    return `${count} ${word}`;
  }
  
  // Русский язык - три формы
  const cases = [2, 0, 1, 1, 1, 2];
  const caseIndex = count % 100 > 4 && count % 100 < 20 
    ? 2 
    : cases[Math.min(count % 10, 5)];
  
  const forms = [
    getTranslation('ru', 'wishlist.itemCount.one'),
    getTranslation('ru', 'wishlist.itemCount.few'),
    getTranslation('ru', 'wishlist.itemCount.many'),
  ];
  
  return `${count} ${forms[caseIndex]}`;
}