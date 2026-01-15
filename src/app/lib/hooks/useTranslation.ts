import { useLanguageStore } from '../../store';
import { getTranslation } from '../../config/i18n';
import type { Language } from '../../config/i18n';

interface UseTranslationReturn {
  t: (key: string, params?: Record<string, string | number>) => string;
  language: Language;
  setLanguage: (language: Language) => void;
}

/**
 * Хук для работы с переводами приложения
 * 
 * Размещён в app/lib/hooks/ т.к. использует app-зависимости:
 * - useLanguageStore из app/store
 * - getTranslation из app/config/i18n
 * 
 * @returns Объект с текущим языком, функцией перевода и функцией смены языка
 * 
 * @example
 * const { t, language, setLanguage } = useTranslation();
 * 
 * // Простой перевод
 * t('common.save') // 'Сохранить' (ru) или 'Save' (en)
 * 
 * // С параметрами
 * t('imageUpload.fileTooLarge', { maxSize: 5 }) 
 * // 'Размер файла слишком большой. Максимальный размер: 5MB.'
 * 
 * // Смена языка
 * setLanguage('en');
 */
export function useTranslation(): UseTranslationReturn {
  const { language, setLanguage } = useLanguageStore();
  
  /**
   * Получить перевод по ключу
   * 
   * @param key - Ключ перевода (например, 'common.save')
   * @param params - Параметры для подстановки (например, { maxSize: 5 })
   * @returns Переведенная строка
   */
  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, key, params);
  };
  
  return {
    t,
    language,
    setLanguage,
  };
}