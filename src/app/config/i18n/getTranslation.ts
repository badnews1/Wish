import { translations, type Language } from './index';

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
  const keys = key.split('.');
  let value: any = translations[language];

  // Навигация по вложенной структуре
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Перевод не найден - возвращаем ключ
      console.warn(`Translation not found: ${key} (${language})`);
      return key;
    }
  }

  // Если значение не строка - возвращаем ключ
  if (typeof value !== 'string') {
    console.warn(`Translation value is not a string: ${key} (${language})`);
    return key;
  }

  // Подстановка параметров
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
      return params[paramKey]?.toString() ?? `{{${paramKey}}}`;
    });
  }

  return value;
}
