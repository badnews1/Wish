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
  const keys = key.split('.');
  let value: Record<string, unknown> | string | undefined = translations[language];

  // Навигация по вложенной структуре
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k] as Record<string, unknown> | string;
    } else {
      // Перевод не найден - возвращаем ключ
      return key;
    }
  }

  // Если значение не строка - возвращаем ключ
  if (typeof value !== 'string') {
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
