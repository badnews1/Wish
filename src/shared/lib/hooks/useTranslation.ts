import { useLanguageStore } from '@/app';
import { getTranslation } from '@/app/config/i18n';

/**
 * Хук для работы с переводами приложения
 * 
 * @returns Объект с текущим языком и функцией перевода
 * 
 * @example
 * const { t, language } = useTranslation();
 * 
 * // Простой перевод
 * t('common.save') // 'Сохранить' (ru) или 'Save' (en)
 * 
 * // С параметрами
 * t('imageUpload.fileTooLarge', { maxSize: 5 }) 
 * // 'Размер файла слишком большой. Максимальный размер: 5MB.'
 */
export function useTranslation() {
  const { language } = useLanguageStore();
  
  /**
   * Получить перевод по ключу
   * 
   * @param key - Ключ перевода (например, 'common.save')
   * @param params - Параметры для подстановки (например, { maxSize: 5 })
   * @returns Переведенная строка
   */
  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(language, key, params);
  };
  
  return {
    t,
    language,
  };
}