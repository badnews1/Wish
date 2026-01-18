/**
 * Утилита для получения переводов с автоматическим определением языка
 * Обёртка над app/config/i18n/getTranslation с автоматическим языком из стора
 */

import { getTranslation as appGetTranslation } from '@/app/config/i18n';
import { useLanguageStore } from '@/app/store';

/**
 * Получить перевод для текущего языка
 * Автоматически берёт язык из глобального стора
 * 
 * @param key - Ключ перевода (например, 'wishlist.notifications.wishlist.created')
 * @param params - Параметры для интерполяции
 * @returns Переведённая строка
 * 
 * @example
 * getTranslation('common.save') // 'Сохранить'
 * getTranslation('validation.minLength', { count: 3 }) // 'Минимум 3 символов'
 */
export function getTranslation(
  key: string,
  params?: Record<string, string | number>
): string {
  const { language } = useLanguageStore.getState();
  return appGetTranslation(language, key, params);
}
