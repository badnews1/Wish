import { translations, type Language } from './translations';

/**
 * Получить перевод по ключу из распределённой системы переводов
 * 
 * @param language - Код языка ('ru' | 'en')
 * @param key - Ключ перевода (например, 'common.save', 'wishlist.card.noImage')
 * @param params - Параметры для подстановки (например, { maxSize: 5 })
 * @returns Переведенная строка или ключ если перевод не найден
 * 
 * @example
 * getTranslation('ru', 'common.save') // 'Сохранить'
 * getTranslation('en', 'wishlist.card.noImage') // 'No photo'
 * getTranslation('ru', 'validation.minLength', { count: 3 }) // 'Минимум 3 символов'
 */
export function getTranslation(
  language: Language,
  key: string,
  params?: Record<string, string | number>
): string {
  // Защита от undefined key
  if (!key || typeof key !== 'string') {
    return '';
  }

  const keys = key.split('.');
  let value: unknown = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Перевод не найден - возвращаем ключ
      return key;
    }
  }

  // Если значение не строка - возвращаем ключ
  if (typeof value !== 'string') {
    return key;
  }

  // Подстановка параметров если они есть
  if (params) {
    return Object.entries(params).reduce((str, [key, val]) => {
      return str.replace(new RegExp(`{${key}}`, 'g'), String(val));
    }, value);
  }

  return value;
}